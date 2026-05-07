package main

import (
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/baditaflorin/netlogo-browser-lab/internal/modelindex"
	"github.com/baditaflorin/netlogo-browser-lab/internal/utils"
)

func main() {
	source := flag.String("source", "data/source/models.seed.json", "Source seed JSON")
	out := flag.String("out", "public/data/v1", "Output directory")
	start := flag.String("start", "", "Optional inclusive model id start cursor")
	end := flag.String("end", "", "Optional inclusive model id end cursor")
	concurrency := flag.Int("concurrency", 1, "Reserved for future parallel source ingestion")
	saveEvery := flag.Int("saveEvery", 100, "Reserved checkpoint interval for larger runs")
	version := flag.String("version", "0.1.0", "Artifact version")
	flag.Parse()

	if *concurrency < 1 {
		finish(fmt.Errorf("concurrency must be >= 1"))
	}
	if *saveEvery < 1 {
		finish(fmt.Errorf("saveEvery must be >= 1"))
	}
	if *start != "" || *end != "" {
		fmt.Fprintf(os.Stderr, "range filters are accepted for CLI stability but not needed for curated v1: start=%s end=%s\n", *start, *end)
	}

	err := modelindex.Build(modelindex.Options{
		Source:          *source,
		OutDir:          *out,
		ArtifactVersion: *version,
		GeneratedAt:     time.Now().UTC(),
	})
	finish(err)
}

func finish(err error) {
	utils.HandleErrorOrLogWithMessages(err, "failed to build model index", "model index built")
	if err != nil {
		os.Exit(1)
	}
}
