import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Photo3DCloud = ({ photos }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [photoObjects, setPhotoObjects] = useState([]);
  const [raycaster] = useState(new THREE.Raycaster());
  const [mouse] = useState(new THREE.Vector2());
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  
  // 初始化 Three.js 场景
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 创建场景
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x000000);
    
    // 创建相机
    const newCamera = new THREE.PerspectiveCamera(
      60, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    newCamera.position.z = 15;
    
    // 创建渲染器
    const newRenderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    newRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    
    // 创建控制器
    const newControls = new OrbitControls(newCamera, canvasRef.current);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.rotateSpeed = 0.5;
    newControls.enableZoom = true;
    newControls.zoomSpeed = 0.5;
    newControls.minDistance = 5;
    newControls.maxDistance = 30;
    newControls.autoRotate = false; // 禁用自动旋转
    
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    newScene.add(ambientLight);
    
    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    newScene.add(directionalLight);
    
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);
    
    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current || !newCamera || !newRenderer) return;
      
      newCamera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      newControls.dispose();
      newRenderer.dispose();
    };
  }, []);
  
  // 加载照片并创建 3D 对象
  useEffect(() => {
    if (!scene || !photos.length) return;
    
    const textureLoader = new THREE.TextureLoader();
    const objects = [];
    
    // 清除现有的照片对象
    photoObjects.forEach(obj => scene.remove(obj));
    
    // 创建新的照片对象
    photos.forEach((photo, index) => {
      textureLoader.load(photo.url, (texture) => {
        // 计算照片的宽高比
        const aspectRatio = texture.image.width / texture.image.height;
        
        // 创建平面几何体
        const width = 1.5 + Math.random() * 1; // 随机宽度，增加变化
        const height = width / aspectRatio;
        const geometry = new THREE.PlaneGeometry(width, height);
        
        // 创建材质
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0 // 初始透明度为0，用于淡入效果
        });
        
        // 创建网格
        const mesh = new THREE.Mesh(geometry, material);
        
        // 随机位置 - 使用更大的范围，创建分散的效果
        const radius = 15 + Math.random() * 10;
        const phi = Math.random() * Math.PI * 2; // 水平角度
        const theta = Math.random() * Math.PI; // 垂直角度
        
        mesh.position.x = radius * Math.sin(theta) * Math.cos(phi);
        mesh.position.y = radius * Math.sin(theta) * Math.sin(phi);
        mesh.position.z = radius * Math.cos(theta);
        
        // 随机旋转
        mesh.rotation.x = Math.random() * 0.2 - 0.1;
        mesh.rotation.y = Math.random() * 0.2 - 0.1;
        
        // 存储照片信息和动画参数
        mesh.userData = { 
          photo,
          index,
          originalPosition: mesh.position.clone(),
          originalRotation: mesh.rotation.clone(),
          // 为每个照片添加随机动画参数
          animation: {
            speed: 0.2 + Math.random() * 0.3,
            amplitude: 0.3 + Math.random() * 0.4, // 晃动幅度
            offset: Math.random() * Math.PI * 2,
            delay: index * 0.1 // 延迟，用于创建涌入效果
          }
        };
        
        scene.add(mesh);
        objects.push(mesh);
        
        // 添加标签
        if (photo.caption) {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 256;
          canvas.height = 64;
          
          context.fillStyle = 'rgba(0, 0, 0, 0.7)';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(photo.caption, canvas.width / 2, canvas.height / 2);
          
          const labelTexture = new THREE.CanvasTexture(canvas);
          const labelMaterial = new THREE.MeshBasicMaterial({
            map: labelTexture,
            transparent: true,
            opacity: 0, // 初始透明度为0
            side: THREE.DoubleSide
          });
          
          const labelGeometry = new THREE.PlaneGeometry(width, height / 4);
          const label = new THREE.Mesh(labelGeometry, labelMaterial);
          
          label.position.set(0, -height / 2 - height / 8, 0);
          mesh.add(label);
        }
        
        // 创建涌入动画
        const targetPosition = {
          x: (Math.random() * 20) - 10,
          y: (Math.random() * 20) - 10,
          z: (Math.random() * 10) - 5
        };
        
        // 设置初始位置在远处
        gsap.fromTo(
          mesh.position, 
          {
            x: mesh.position.x * 2,
            y: mesh.position.y * 2,
            z: mesh.position.z * 2
          },
          {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2 + Math.random() * 1,
            delay: 0.1 * index,
            ease: "power2.out",
            onComplete: () => {
              // 更新原始位置为动画结束位置
              mesh.userData.originalPosition.set(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
              );
            }
          }
        );
        
        // 淡入动画
        gsap.to(mesh.material, {
          opacity: 1,
          duration: 1,
          delay: 0.1 * index,
          ease: "power1.inOut"
        });
        
        // 如果有标签，也为标签添加淡入效果
        if (mesh.children.length > 0) {
          gsap.to(mesh.children[0].material, {
            opacity: 0.8,
            duration: 1,
            delay: 0.1 * index + 0.5,
            ease: "power1.inOut"
          });
        }
      });
    });
    
    setPhotoObjects(objects);
  }, [scene, photos]);
  
  // 动画循环
  useEffect(() => {
    if (!scene || !camera || !renderer || !controls) return;
    
    let animationFrameId;
    let lastTime = 0;
    
    const animate = (time) => {
      animationFrameId = requestAnimationFrame(animate);
      
      // 计算时间差
      const delta = time - lastTime;
      lastTime = time;
      
      // 更新照片动画 - 只做上下左右晃动，不旋转
      if (!selectedPhoto && photoObjects.length > 0 && !isAnimating) {
        photoObjects.forEach(obj => {
          const anim = obj.userData.animation;
          const originalPos = obj.userData.originalPosition;
          
          // 使用正弦和余弦函数创建晃动效果
          const t = time * 0.001 * anim.speed + anim.offset;
          
          // 只修改位置，不修改旋转
          obj.position.x = originalPos.x + Math.sin(t) * anim.amplitude;
          obj.position.y = originalPos.y + Math.cos(t * 0.7) * anim.amplitude;
          obj.position.z = originalPos.z + Math.sin(t * 0.5) * (anim.amplitude * 0.5);
        });
      }
      
      // 更新控制器
      controls.update();
      
      // 渲染场景
      renderer.render(scene, camera);
    };
    
    animate(0);
    animationRef.current = animate;
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scene, camera, renderer, controls, photoObjects, selectedPhoto, isAnimating]);
  
  // 处理鼠标点击
  const handleMouseClick = (event) => {
    if (isAnimating || !scene || !camera) return;
    
    // 计算鼠标位置
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // 设置射线
    raycaster.setFromCamera(mouse, camera);
    
    // 检测相交的对象
    const intersects = raycaster.intersectObjects(photoObjects);
    
    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      const photoData = selectedObject.userData.photo;
      
      if (selectedPhoto === photoData) {
        // 如果点击的是当前选中的照片，则返回云状态
        resetPhotoPositions();
        setSelectedPhoto(null);
      } else {
        // 选中新照片
        setIsAnimating(true);
        
        // 将其他照片移开
        photoObjects.forEach(obj => {
          if (obj !== selectedObject) {
            const direction = obj.position.clone().sub(camera.position).normalize();
            const targetPosition = obj.position.clone().add(direction.multiplyScalar(10));
            
            gsap.to(obj.position, {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: 1,
              ease: "power2.out"
            });
            
            gsap.to(obj.material, {
              opacity: 0.3,
              duration: 0.5
            });
          }
        });
        
        // 将选中的照片移到相机前方
        const targetPosition = new THREE.Vector3(0, 0, camera.position.z - 5);
        
        gsap.to(selectedObject.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 1,
          ease: "power2.out"
        });
        
        gsap.to(selectedObject.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => setIsAnimating(false)
        });
        
        setSelectedPhoto(photoData);
      }
    } else if (selectedPhoto) {
      // 如果点击空白区域且有选中的照片，则返回云状态
      resetPhotoPositions();
      setSelectedPhoto(null);
    }
  };
  
  // 重置所有照片位置
  const resetPhotoPositions = () => {
    setIsAnimating(true);
    
    photoObjects.forEach(obj => {
      const originalPosition = obj.userData.originalPosition;
      const originalRotation = obj.userData.originalRotation;
      
      gsap.to(obj.position, {
        x: originalPosition.x,
        y: originalPosition.y,
        z: originalPosition.z,
        duration: 1,
        ease: "power2.inOut"
      });
      
      gsap.to(obj.rotation, {
        x: originalRotation.x,
        y: originalRotation.y,
        z: originalRotation.z,
        duration: 1,
        ease: "power2.inOut"
      });
      
      gsap.to(obj.material, {
        opacity: 1,
        duration: 0.5
      });
    });
    
    setTimeout(() => setIsAnimating(false), 1000);
  };
  
  return (
    <CloudContainer ref={containerRef}>
      <Canvas ref={canvasRef} onClick={handleMouseClick} />
      
      {selectedPhoto && (
        <PhotoInfo>
          <h3>{selectedPhoto.caption}</h3>
          <p>{selectedPhoto.description}</p>
          <CloseButton onClick={() => {
            resetPhotoPositions();
            setSelectedPhoto(null);
          }}>
            返回照片云
          </CloseButton>
        </PhotoInfo>
      )}
      
      <Instructions>
        <p>点击照片查看详情 • 拖动旋转视角 • 滚轮缩放</p>
      </Instructions>
    </CloudContainer>
  );
};

const CloudContainer = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 600px;
  background-color: #000;
  overflow: hidden;
  border-radius: 8px;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const PhotoInfo = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  
  h3 {
    margin-top: 0;
    font-size: 1.5rem;
    font-weight: 500;
  }
  
  p {
    margin-bottom: 15px;
    line-height: 1.5;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Instructions = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  pointer-events: none;
`;

export default Photo3DCloud;
