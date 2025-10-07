// Created by Anderson Mancini 2023
// React Three Fiber Ultimate LensFlare
// To be used Effect together with react-three/postprocessing

import { Uniform, Color, Vector3 } from 'three'
import { BlendFunction, Effect } from 'postprocessing'
import { wrapEffect } from './util.jsx'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const LensFlareShader = {
  fragmentShader: /* glsl */ `
  uniform float iTime;
  uniform vec2 lensPosition;
  uniform vec2 iResolution;
  uniform vec3 colorGain;
  uniform float starPoints;
  uniform float glareSize;
  uniform float flareSize;
  uniform float flareSpeed;
  uniform float flareShape;
  uniform float haloScale;
  uniform float opacity;
  uniform bool animated;
  uniform bool anamorphic;
  uniform bool enabled;
  uniform bool secondaryGhosts;
  uniform bool starBurst;
  uniform float ghostScale;
  uniform bool aditionalStreaks;
  uniform sampler2D lensDirtTexture;
  
  vec2 vxtC;
  
  float rndf(float n){return fract(sin(n) * 43758.5453123);}
  float niz(float p){float fl = floor(p);float fc = fract(p);return mix(rndf(fl),rndf(fl + 1.0), fc);}
  vec3 hsv2rgb(vec3 c){vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);}
  float satU(float x){return clamp(x, 0.,1.);}
  vec2 rtU(vec2 naz, float rtn){return vec2(cos(rtn) * naz.x + sin(rtn) * naz.y,cos(rtn) * naz.y - sin(rtn) * naz.x);}
  
  vec3 drwF(vec2 p, float intensity, float rnd, float speed, int id){
    float flhos = (1. / 32.) * float(id) * 0.1;
    float lingrad = distance(vec2(0.), p);
    float expg = 1. / exp(lingrad * (fract(rnd) * 0.66 + 0.33));
    vec3 qzTg = hsv2rgb(vec3( fract( (expg * 8.) + speed * flareSpeed + flhos), pow(1.-abs(expg*2.-1.), 0.45), 20.0 * expg * intensity));
    float internalStarPoints;
    if(anamorphic){
      internalStarPoints = 1.0;
    } else{
      internalStarPoints = starPoints;
    }
    float ams = length(p * flareShape * sin(internalStarPoints * atan(p.x, p.y)));
    float kJhg = pow(1.-satU(ams), ( anamorphic ? 100. : 12.));
    kJhg += satU(expg-0.9) * 3.;
    kJhg = pow(kJhg * expg, 8. + (1.-intensity) * 5.);
    if(flareSpeed > 0.0){
      return vec3(kJhg) * qzTg;
    } else{
      return vec3(kJhg) * flareSize * 15.;
    }
  }
  
  float glR(vec2 naz, vec2 pos, float zsi){
    vec2 mni;
    if(animated){
      mni = rtU(naz-pos, iTime * 0.1);
    } else{
      mni = naz-pos;
    }
    float ang = atan(mni.y, mni.x) * (anamorphic ? 1.0 : starPoints);
    float ams2 = length(mni);
    ams2 = pow(ams2, .9);
    float f0 = 1.0/(length(naz-pos)*(1.0/zsi*16.0)+.2);
    return f0+f0*(sin((ang))*.2 +.3);
  }
  
  vec3 mLs(vec2 naz, vec2 pos){
    vec2 mni = naz-pos;
    vec2 zxMp = naz*(length(naz));
    float ang = atan(mni.x,mni.y);
    float f0 = .3/(length(naz-pos)*16.0+1.0);
    f0 = f0*(sin(niz(sin(ang*3.9-(animated ? iTime : 0.0) * 0.3) * starPoints))*.2 );
    float f1 = max(0.01-pow(length(naz+1.2*pos),1.9),.0)*7.0;
    float f2 = max(.9/(10.0+32.0*pow(length(zxMp+0.99*pos),2.0)),.0)*0.35;
    float f22 = max(.9/(11.0+32.0*pow(length(zxMp+0.85*pos),2.0)),.0)*0.23;
    float f23 = max(.9/(12.0+32.0*pow(length(zxMp+0.95*pos),2.0)),.0)*0.6;
    vec2 ztX = mix(naz,zxMp, 0.1);
    float f4 = max(0.01-pow(length(ztX+0.4*pos),2.9),.0)*4.02;
    float f42 = max(0.0-pow(length(ztX+0.45*pos),2.9),.0)*4.1;
    float f43 = max(0.01-pow(length(ztX+0.5*pos),2.9),.0)*4.6;
    ztX = mix(naz,zxMp,-.4);
    float f5 = max(0.01-pow(length(ztX+0.1*pos),5.5),.0)*2.0;
    float f52 = max(0.01-pow(length(ztX+0.2*pos),5.5),.0)*2.0;
    float f53 = max(0.01-pow(length(ztX+0.1*pos),5.5),.0)*2.0;
    ztX = mix(naz,zxMp, 2.1);
    float f6 = max(0.01-pow(length(ztX-0.3*pos),1.61),.0)*3.159;
    float f62 = max(0.01-pow(length(ztX-0.325*pos),1.614),.0)*3.14;
    float f63 = max(0.01-pow(length(ztX-0.389*pos),1.623),.0)*3.12;
    
    vec3 c = vec3(glR(naz,pos, glareSize));
    
    vec2 prot;
    if(animated){
      prot = rtU(naz - pos, (iTime * 0.1));
    } else if(anamorphic){
      prot = rtU(naz - pos, 1.570796);
    } else {
      prot = naz - pos;
    }
    c += drwF(prot, (anamorphic ? flareSize * 10. : flareSize), 0.1, iTime, 1);
    c.r+=f1+f2+f4+f5+f6; 
    c.g+=f1+f22+f42+f52+f62; 
    c.b+=f1+f23+f43+f53+f63;
    c = c*1.3 * vec3(length(zxMp)+.09);
    c+=vec3(f0);
    return c;
  }
  
  void mainImage(vec4 v, vec2 r, out vec4 i){
    vec2 g = r - 0.5;
    g.y *= iResolution.y / iResolution.x;
    vec2 l = lensPosition * 0.5;
    l.y *= iResolution.y / iResolution.x;
    vec3 f = mLs(g, l) * 20. * colorGain / 256.;
    
    i = enabled ? vec4(mix(f, vec3(0), opacity) + v.xyz, v.w) : vec4(v);
  }
`
}

export class LensFlareEffect extends Effect {
  constructor({
    blendFunction = BlendFunction.NORMAL,
    enabled = true,
    glareSize = 0.2,
    lensPosition = [0.01, 0.01],
    iResolution = [0, 0],
    starPoints = 6,
    flareSize = 0.01,
    flareSpeed = 0.01,
    flareShape = 0.01,
    animated = true,
    anamorphic = false,
    colorGain = new Color(70, 70, 70),
    lensDirtTexture = null,
    haloScale = 0.5,
    secondaryGhosts = true,
    aditionalStreaks = true,
    ghostScale = 0.0,
    opacity = 1.0,
    starBurst = true
  } = {}) {
    super('LensFlareEffect', LensFlareShader.fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ['enabled', new Uniform(enabled)],
        ['glareSize', new Uniform(glareSize)],
        ['lensPosition', new Uniform(lensPosition)],
        ['iTime', new Uniform(0)],
        ['iResolution', new Uniform(iResolution)],
        ['starPoints', new Uniform(starPoints)],
        ['flareSize', new Uniform(flareSize)],
        ['flareSpeed', new Uniform(flareSpeed)],
        ['flareShape', new Uniform(flareShape)],
        ['animated', new Uniform(animated)],
        ['anamorphic', new Uniform(anamorphic)],
        ['colorGain', new Uniform(colorGain)],
        ['lensDirtTexture', new Uniform(lensDirtTexture)],
        ['haloScale', new Uniform(haloScale)],
        ['secondaryGhosts', new Uniform(secondaryGhosts)],
        ['aditionalStreaks', new Uniform(aditionalStreaks)],
        ['ghostScale', new Uniform(ghostScale)],
        ['starBurst', new Uniform(starBurst)],
        ['opacity', new Uniform(opacity)]
      ])
    })
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('iTime').value += deltaTime
  }
}

const LensFlare = wrapEffect(LensFlareEffect)

function UltimateLensFlareEffect({
  position = { x: -10, y: 4, z: -18 },
  blendFunction = BlendFunction.NORMAL,
  glareSize = 0.35,
  followMouse = false,
  starPoints = 6.0,
  flareSize = 0.005,
  flareSpeed = 0.3,
  flareShape = 0.02,
  animated = true,
  anamorphic = false,
  colorGain = new Color(256, 160, 100),
  haloScale = 0.5,
  secondaryGhosts = true,
  aditionalStreaks = true,
  ghostScale = 0.5,
  starBurst = true,
  enabled = true,
  opacity = 1.0
}) {
  const lensRef = useRef()
  const screenPosition = new Vector3(position.x, position.y, position.z)
  let flarePosition = new Vector3()
  const { viewport, raycaster } = useThree()

  let projectedPosition

  useFrame(({ scene, mouse, camera, delta }) => {
    if (lensRef?.current) {
      if (followMouse) {
        lensRef.current.uniforms.get('lensPosition').value.x = mouse.x
        lensRef.current.uniforms.get('lensPosition').value.y = mouse.y
        lensRef.current.uniforms.get('opacity').value = 0.0
      } else {
        projectedPosition = screenPosition.clone()
        projectedPosition.project(camera)

        flarePosition.set(projectedPosition.x, projectedPosition.y, projectedPosition.z)

        if (flarePosition.z > 1) return

        raycaster.setFromCamera(projectedPosition, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)

        if (intersects[0]) {
          // オクルージョン処理を簡略化
          lensRef.current.uniforms.get('opacity').value = 1.0
        } else {
          lensRef.current.uniforms.get('opacity').value = 0.0
        }

        lensRef.current.uniforms.get('lensPosition').value.x = flarePosition.x
        lensRef.current.uniforms.get('lensPosition').value.y = flarePosition.y
      }
    }
  })

  useEffect(() => {
    if (lensRef?.current) {
      lensRef.current.uniforms.get('iResolution').value.x = viewport.width
      lensRef.current.uniforms.get('iResolution').value.y = viewport.height
    }
  }, [viewport])

  return useMemo(
    () => (
      <LensFlare
        ref={lensRef}
        iResolution={{ x: viewport.width, y: viewport.height }}
        blendFunction={blendFunction}
        glareSize={glareSize}
        starPoints={starPoints}
        flareSize={flareSize}
        flareSpeed={flareSpeed}
        flareShape={flareShape}
        animated={animated}
        anamorphic={anamorphic}
        colorGain={colorGain}
        haloScale={haloScale}
        secondaryGhosts={secondaryGhosts}
        aditionalStreaks={aditionalStreaks}
        ghostScale={ghostScale}
        starBurst={starBurst}
        enabled={enabled}
        opacity={opacity}
      />
    ),
    [
      glareSize,
      blendFunction,
      starPoints,
      flareSize,
      flareSpeed,
      flareShape,
      animated,
      anamorphic,
      colorGain,
      haloScale,
      secondaryGhosts,
      aditionalStreaks,
      ghostScale,
      starBurst,
      enabled,
      opacity,
      viewport.width,
      viewport.height
    ]
  )
}

export default UltimateLensFlareEffect