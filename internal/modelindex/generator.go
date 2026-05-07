package modelindex

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/baditaflorin/netlogo-browser-lab/pkg/contracts"
)

const SchemaVersion = "v1"

type Options struct {
	Source          string
	OutDir          string
	ArtifactVersion string
	GeneratedAt     time.Time
}

func Build(options Options) error {
	if options.Source == "" {
		return errors.New("source is required")
	}
	if options.OutDir == "" {
		return errors.New("out directory is required")
	}
	if options.ArtifactVersion == "" {
		options.ArtifactVersion = "0.1.0"
	}
	if options.GeneratedAt.IsZero() {
		options.GeneratedAt = time.Now().UTC()
	}

	sourceBytes, err := os.ReadFile(options.Source)
	if err != nil {
		return fmt.Errorf("read source: %w", err)
	}

	var artifact contracts.Artifact
	if err := json.Unmarshal(sourceBytes, &artifact); err != nil {
		return fmt.Errorf("decode source: %w", err)
	}
	artifact.SchemaVersion = SchemaVersion
	normalizeModels(artifact.Models)
	if err := validateArtifact(artifact); err != nil {
		return err
	}

	if err := os.MkdirAll(options.OutDir, 0o755); err != nil {
		return fmt.Errorf("create output directory: %w", err)
	}

	modelsPath := filepath.Join(options.OutDir, "models.json")
	if err := writeJSON(modelsPath, artifact); err != nil {
		return err
	}

	meta := contracts.Meta{
		SchemaVersion:   SchemaVersion,
		ArtifactVersion: options.ArtifactVersion,
		GeneratedAt:     options.GeneratedAt.Format(time.RFC3339),
		SourceCommit:    sourceCommit(),
		InputChecksum:   checksum(sourceBytes),
		ModelCount:      len(artifact.Models),
	}
	if err := writeJSON(filepath.Join(options.OutDir, "models.meta.json"), meta); err != nil {
		return err
	}

	return nil
}

func normalizeModels(models []contracts.Model) {
	for index := range models {
		sort.Strings(models[index].Tags)
	}
	sort.SliceStable(models, func(left int, right int) bool {
		return strings.ToLower(models[left].Title) < strings.ToLower(models[right].Title)
	})
}

func validateArtifact(artifact contracts.Artifact) error {
	seen := map[string]struct{}{}
	if len(artifact.Models) == 0 {
		return errors.New("at least one model is required")
	}
	for _, model := range artifact.Models {
		if model.ID == "" || model.Title == "" || model.SimulationKind == "" {
			return fmt.Errorf("model %q is missing id, title, or simulationKind", model.ID)
		}
		if _, ok := seen[model.ID]; ok {
			return fmt.Errorf("duplicate model id %q", model.ID)
		}
		seen[model.ID] = struct{}{}
		if _, err := url.ParseRequestURI(model.SourceURL); err != nil {
			return fmt.Errorf("model %q has invalid source URL: %w", model.ID, err)
		}
		if len(model.Mechanics) == 0 {
			return fmt.Errorf("model %q needs mechanics", model.ID)
		}
	}
	return nil
}

func writeJSON(path string, value any) error {
	bytes, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return fmt.Errorf("encode %s: %w", path, err)
	}
	bytes = append(bytes, '\n')
	if err := os.WriteFile(path, bytes, 0o644); err != nil {
		return fmt.Errorf("write %s: %w", path, err)
	}
	return nil
}

func checksum(bytes []byte) string {
	sum := sha256.Sum256(bytes)
	return hex.EncodeToString(sum[:])
}

func sourceCommit() string {
	command := exec.Command("git", "rev-parse", "--short", "HEAD")
	output, err := command.Output()
	if err != nil {
		return "uncommitted"
	}
	return strings.TrimSpace(string(output))
}
