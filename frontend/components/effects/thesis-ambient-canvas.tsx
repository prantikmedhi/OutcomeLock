"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const vertexSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;

  uniform vec2 uResolution;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float drift = sin(uv.y * 7.0 + uTime * 0.12) * 0.14;
    float wave = sin((uv.x + drift) * 12.0 + uv.y * 4.0 + uTime * 0.08);
    float contour = smoothstep(0.82, 0.98, abs(wave));
    float vignette = 1.0 - smoothstep(0.28, 0.9, length(centered));
    float alpha = (0.012 + contour * 0.055) * vignette;
    gl_FragColor = vec4(0.24, 0.67, 0.56, alpha);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function ThesisAmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      failIfMajorPerformanceCaveat: true,
      powerPreference: "low-power",
      premultipliedAlpha: true,
      stencil: false,
    });

    if (!gl) {
      canvas.dataset.webglState = "unavailable";
      return;
    }

    let program: WebGLProgram | null = null;
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    let buffer: WebGLBuffer | null = null;
    let positionLocation = -1;
    let resolutionLocation: WebGLUniformLocation | null = null;
    let timeLocation: WebGLUniformLocation | null = null;
    let animationFrame = 0;
    let lastDraw = 0;
    let startTime = performance.now();
    let isVisible = true;
    let contextLost = false;
    let ready = false;

    const releaseResources = () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      buffer = null;
      program = null;
      vertexShader = null;
      fragmentShader = null;
      positionLocation = -1;
      resolutionLocation = null;
      timeLocation = null;
      ready = false;
    };

    const initialize = () => {
      releaseResources();
      const fail = () => {
        releaseResources();
        return false;
      };

      vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
      fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertexShader || !fragmentShader) return fail();

      program = gl.createProgram();
      buffer = gl.createBuffer();
      if (!program || !buffer) return fail();

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fail();

      positionLocation = gl.getAttribLocation(program, "aPosition");
      resolutionLocation = gl.getUniformLocation(program, "uResolution");
      timeLocation = gl.getUniformLocation(program, "uTime");
      if (positionLocation < 0 || !resolutionLocation || !timeLocation) return fail();

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      ready = true;
      return true;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const draw = (seconds: number) => {
      if (!ready || !program || contextLost) return;
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const stop = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const tick = (now: number) => {
      animationFrame = 0;
      if (!ready || document.hidden || !isVisible || contextLost) return;

      if (now - lastDraw >= 1000 / 30) {
        draw((now - startTime) / 1000);
        lastDraw = now;
      }
      animationFrame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!ready || shouldReduceMotion || animationFrame || document.hidden || !isVisible || contextLost) return;
      startTime = performance.now();
      lastDraw = 0;
      animationFrame = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      ready = false;
      stop();
      canvas.dataset.webglState = "lost";
    };

    const handleContextRestored = () => {
      contextLost = false;
      if (!initialize()) {
        canvas.dataset.webglState = "unavailable";
        return;
      }
      resize();
      if (shouldReduceMotion) {
        draw(0);
        canvas.dataset.webglState = "static";
      } else {
        canvas.dataset.webglState = "animated";
        start();
      }
    };

    if (!initialize()) {
      canvas.dataset.webglState = "unavailable";
      releaseResources();
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (shouldReduceMotion) draw(0);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
      if (isVisible) start();
      else stop();
    });
    intersectionObserver.observe(canvas);

    document.addEventListener("visibilitychange", handleVisibility);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    resize();
    if (shouldReduceMotion) {
      draw(0);
      canvas.dataset.webglState = "static";
    } else {
      canvas.dataset.webglState = "animated";
      start();
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      if (!gl.isContextLost()) releaseResources();
    };
  }, [shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="thesis-ambient-canvas"
      aria-hidden="true"
      data-webgl-state="initializing"
    />
  );
}
