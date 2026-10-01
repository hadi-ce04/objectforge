# ObjectForge

> Multi-view object reconstruction prototype for turning tabletop snapshots into an interactive 3D voxel-style model.

ObjectForge is a lightweight computer-vision / 3D-graphics project built around the idea of reconstructing a physical object from multiple camera angles.

The repository intentionally separates the **reconstruction pipeline** from the **interactive browser viewer**, making it easy to replace the prototype reconstruction stage with a real COLMAP / PyTorch / point-cloud pipeline later.

## What it demonstrates

- Multi-angle image ingestion
- Reconstruction pipeline architecture
- Point-cloud and voxel representation concepts
- Interactive 3D browser visualization
- Orbit / zoom camera controls
- Local FastAPI service
- A clean path toward COLMAP, PyTorch and WebGPU acceleration

## Architecture

```text
Multi-view images
       │
       ▼
┌─────────────────────┐
│ Image / View Loader  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Camera Pose / SfM    │
│   (future COLMAP)    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Point Cloud Fusion   │
│   (future PyTorch)   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Voxel Occupancy      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Three.js Viewer      │
└─────────────────────┘
```

## Current prototype

The current release focuses on the end-to-end product experience and browser-side 3D visualization. Uploaded images are accepted by a local FastAPI endpoint, while the viewport renders an interactive voxel-style reconstruction preview.

This is deliberately a **prototype**, not a claim of production-grade photogrammetry.

## Run locally

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start:

```bash
uvicorn app:app --reload
```

Open:

```text
http://127.0.0.1:8000
```

Add 3–12 images from different angles and launch the reconstruction preview.

## Roadmap

### Phase 1
- [x] Multi-view upload
- [x] Local API
- [x] Interactive 3D viewer
- [x] Voxel-style visualization

### Phase 2
- [ ] COLMAP structure-from-motion
- [ ] Camera pose extraction
- [ ] Sparse point-cloud export
- [ ] Open3D point-cloud processing

### Phase 3
- [ ] PyTorch reconstruction model
- [ ] Neural point-cloud refinement
- [ ] TSDF / voxel fusion
- [ ] GPU acceleration

### Phase 4
- [ ] WebGPU renderer
- [ ] Web Worker processing
- [ ] Progressive reconstruction
- [ ] Real-time point-cloud streaming

## Suggested capture setup

For a real reconstruction pipeline, capture the object from approximately 8–12 angles while keeping:

- the object stationary
- lighting reasonably consistent
- substantial overlap between neighboring views
- the camera distance approximately constant
- the object clearly separated from the background

## Tech stack

**Backend**
- Python
- FastAPI

**Computer Vision / Reconstruction direction**
- COLMAP
- Open3D
- PyTorch
- NumPy

**3D**
- Three.js
- WebGPU roadmap

## Why I built this

The project explores the boundary between computer vision and interactive graphics: taking something captured by a camera, converting it into a spatial representation, and making that representation useful in a browser.

## License

MIT
