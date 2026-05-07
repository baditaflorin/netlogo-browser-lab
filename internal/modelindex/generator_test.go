package modelindex

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/baditaflorin/netlogo-browser-lab/pkg/contracts"
)

func TestBuildWritesArtifacts(t *testing.T) {
	t.Parallel()
	temp := t.TempDir()
	source := filepath.Join(temp, "seed.json")
	out := filepath.Join(temp, "out")
	seed := contracts.Artifact{
		Models: []contracts.Model{
			{
				ID:             "zebra",
				Title:          "Zebra",
				Category:       "Biology",
				Difficulty:     "Intro",
				Tags:           []string{"b", "a"},
				SourceURL:      "https://example.com/model",
				License:        "MIT",
				Summary:        "A test model.",
				Mechanics:      []string{"Agents move."},
				SimulationKind: "traffic",
			},
		},
	}
	bytes, err := json.Marshal(seed)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(source, bytes, 0o644); err != nil {
		t.Fatal(err)
	}

	err = Build(Options{
		Source:          source,
		OutDir:          out,
		ArtifactVersion: "test",
		GeneratedAt:     time.Date(2026, 5, 8, 0, 0, 0, 0, time.UTC),
	})
	if err != nil {
		t.Fatal(err)
	}

	modelBytes, err := os.ReadFile(filepath.Join(out, "models.json"))
	if err != nil {
		t.Fatal(err)
	}
	var artifact contracts.Artifact
	if err := json.Unmarshal(modelBytes, &artifact); err != nil {
		t.Fatal(err)
	}
	if artifact.SchemaVersion != SchemaVersion {
		t.Fatalf("schema version = %q", artifact.SchemaVersion)
	}
	if artifact.Models[0].Tags[0] != "a" {
		t.Fatalf("tags were not normalized: %#v", artifact.Models[0].Tags)
	}
}
