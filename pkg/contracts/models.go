package contracts

type Parameter struct {
	Name    string  `json:"name"`
	Label   string  `json:"label"`
	Min     float64 `json:"min"`
	Max     float64 `json:"max"`
	Step    float64 `json:"step"`
	Default float64 `json:"default"`
	Unit    string  `json:"unit"`
}

type RuntimeSupport struct {
	VisualPreview bool   `json:"visualPreview"`
	CheerpJ       string `json:"cheerpj"`
	WebGPU        string `json:"webgpu"`
	LocalExplain  string `json:"localExplain"`
}

type Model struct {
	ID                string            `json:"id"`
	Title             string            `json:"title"`
	Category          string            `json:"category"`
	Difficulty        string            `json:"difficulty"`
	Tags              []string          `json:"tags"`
	SourceURL         string            `json:"sourceUrl"`
	License           string            `json:"license"`
	Summary           string            `json:"summary"`
	Mechanics         []string          `json:"mechanics"`
	DefaultParameters []Parameter       `json:"defaultParameters"`
	Runtime           RuntimeSupport    `json:"runtime"`
	SimulationKind    string            `json:"simulationKind"`
	TeacherPrompts    []string          `json:"teacherPrompts"`
	References        map[string]string `json:"references"`
}

type Artifact struct {
	SchemaVersion string  `json:"schemaVersion"`
	Models        []Model `json:"models"`
}

type Meta struct {
	SchemaVersion   string `json:"schemaVersion"`
	ArtifactVersion string `json:"artifactVersion"`
	GeneratedAt     string `json:"generatedAt"`
	SourceCommit    string `json:"sourceCommit"`
	InputChecksum   string `json:"inputChecksum"`
	ModelCount      int    `json:"modelCount"`
}
