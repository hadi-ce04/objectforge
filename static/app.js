import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090d);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(4.4, 3.3, 5.4);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(document.getElementById("scene").clientWidth, 520);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById("scene").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, .15, 0);

scene.add(new THREE.AmbientLight(0xffffff, 1.8));
const key = new THREE.DirectionalLight(0xffffff, 3);
key.position.set(4, 6, 5);
scene.add(key);

const grid = new THREE.GridHelper(7, 28, 0x26313c, 0x111821);
grid.position.y = -1.35;
scene.add(grid);

const group = new THREE.Group();
scene.add(group);

function seeded(x,y,z){ return Math.sin(x*12.7+y*7.3+z*4.1)*.5+.5; }

for(let i=0;i<900;i++){
  const a = Math.random()*Math.PI*2;
  const h = (Math.random()*2-1);
  const r = .9 + Math.random()*.35;
  const x = Math.cos(a)*r*(.82+.18*Math.cos(h*3));
  const z = Math.sin(a)*r*(.82+.18*Math.cos(h*3));
  const y = h*1.25;
  if(x*x+z*z < .45 && Math.random()<.55) continue;
  const s=.075+Math.random()*.045;
  const g = new THREE.BoxGeometry(s,s,s);
  const m = new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.42,.55,.48+Math.random()*.12),roughness:.75});
  const cube=new THREE.Mesh(g,m);
  cube.position.set(x,y,z);
  group.add(cube);
}

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.48,.012,8,96),
  new THREE.MeshBasicMaterial({color:0x70e6b0})
);
ring.rotation.x=Math.PI/2;
ring.position.y=-1.31;
scene.add(ring);

function resize(){
  const el=document.getElementById("scene");
  camera.aspect=el.clientWidth/520;
  camera.updateProjectionMatrix();
  renderer.setSize(el.clientWidth,520);
}
addEventListener("resize",resize);

function animate(){
  requestAnimationFrame(animate);
  group.rotation.y += .0018;
  ring.rotation.z += .001;
  controls.update();
  renderer.render(scene,camera);
}
animate();

const input=document.getElementById("files");
const browse=document.getElementById("browse");
const drop=document.getElementById("dropzone");
const thumbs=document.getElementById("thumbs");
const button=document.getElementById("reconstruct");
const message=document.getElementById("message");
let selected=[];

browse.onclick=()=>input.click();
input.onchange=()=>addFiles([...input.files]);
drop.ondragover=e=>{e.preventDefault();drop.style.borderColor="#70e6b0"};
drop.ondragleave=()=>drop.style.borderColor="#303a47";
drop.ondrop=e=>{e.preventDefault();drop.style.borderColor="#303a47";addFiles([...e.dataTransfer.files])};

function addFiles(files){
  selected=[...selected,...files.filter(f=>f.type.startsWith("image/"))].slice(0,12);
  thumbs.innerHTML="";
  selected.forEach(f=>{
    const img=document.createElement("img");
    img.src=URL.createObjectURL(f);
    thumbs.appendChild(img);
  });
  document.getElementById("count").textContent=`${selected.length} / 12`;
  document.getElementById("mViews").textContent=selected.length;
  button.disabled=selected.length<3;
  message.textContent=selected.length<3 ? "Add at least 3 angles to begin." : "Ready for local reconstruction.";
}

button.onclick=async()=>{
  button.disabled=true;
  message.textContent="Estimating camera poses and fusing views…";
  document.getElementById("mStatus").textContent="RUNNING";
  const data=new FormData();
  selected.forEach(f=>data.append("files",f));
  try{
    const r=await fetch("/api/reconstruct",{method:"POST",body:data});
    const j=await r.json();
    message.textContent=`Reconstruction complete: ${j.model.points.toLocaleString()} points → ${j.model.resolution}³ voxel grid.`;
    document.getElementById("mStatus").textContent="COMPLETE";
    document.getElementById("mStatus").classList.add("green");
  }catch{
    message.textContent="Local preview generated. API is unavailable.";
    document.getElementById("mStatus").textContent="PREVIEW";
  }
  button.disabled=false;
};

fetch("/api/health").then(()=>document.getElementById("api").textContent="ONLINE").catch(()=>document.getElementById("api").textContent="OFFLINE");
