// src/componentTaggerPlugin.ts
import { parse } from "@babel/parser";
import * as esbuild from "esbuild";
import fs from "fs/promises";
import MagicString from "magic-string";
import path2 from "path";
import resolveConfig from "tailwindcss/resolveConfig.js";

// src/util.ts
import path from "path";
import { existsSync } from "fs";
function findProjectRoot(startPath = process.cwd()) {
  try {
    let currentPath = startPath;
    let count = 0;
    while (currentPath !== path.parse(currentPath).root && count < 20) {
      if (existsSync(path.join(currentPath, "package.json"))) {
        return currentPath;
      }
      currentPath = path.dirname(currentPath);
      count++;
    }
    return process.cwd();
  } catch (error) {
    console.error("Error finding project root:", error);
    return process.cwd();
  }
}
var threeFiberElems = [
  "object3D",
  "audioListener",
  "positionalAudio",
  "mesh",
  "batchedMesh",
  "instancedMesh",
  "scene",
  "sprite",
  "lOD",
  "skinnedMesh",
  "skeleton",
  "bone",
  "lineSegments",
  "lineLoop",
  "points",
  "group",
  "camera",
  "perspectiveCamera",
  "orthographicCamera",
  "cubeCamera",
  "arrayCamera",
  "instancedBufferGeometry",
  "bufferGeometry",
  "boxBufferGeometry",
  "circleBufferGeometry",
  "coneBufferGeometry",
  "cylinderBufferGeometry",
  "dodecahedronBufferGeometry",
  "extrudeBufferGeometry",
  "icosahedronBufferGeometry",
  "latheBufferGeometry",
  "octahedronBufferGeometry",
  "planeBufferGeometry",
  "polyhedronBufferGeometry",
  "ringBufferGeometry",
  "shapeBufferGeometry",
  "sphereBufferGeometry",
  "tetrahedronBufferGeometry",
  "torusBufferGeometry",
  "torusKnotBufferGeometry",
  "tubeBufferGeometry",
  "wireframeGeometry",
  "tetrahedronGeometry",
  "octahedronGeometry",
  "icosahedronGeometry",
  "dodecahedronGeometry",
  "polyhedronGeometry",
  "tubeGeometry",
  "torusKnotGeometry",
  "torusGeometry",
  "sphereGeometry",
  "ringGeometry",
  "planeGeometry",
  "latheGeometry",
  "shapeGeometry",
  "extrudeGeometry",
  "edgesGeometry",
  "coneGeometry",
  "cylinderGeometry",
  "circleGeometry",
  "boxGeometry",
  "capsuleGeometry",
  "material",
  "shadowMaterial",
  "spriteMaterial",
  "rawShaderMaterial",
  "shaderMaterial",
  "pointsMaterial",
  "meshPhysicalMaterial",
  "meshStandardMaterial",
  "meshPhongMaterial",
  "meshToonMaterial",
  "meshNormalMaterial",
  "meshLambertMaterial",
  "meshDepthMaterial",
  "meshDistanceMaterial",
  "meshBasicMaterial",
  "meshMatcapMaterial",
  "lineDashedMaterial",
  "lineBasicMaterial",
  "primitive",
  "light",
  "spotLightShadow",
  "spotLight",
  "pointLight",
  "rectAreaLight",
  "hemisphereLight",
  "directionalLightShadow",
  "directionalLight",
  "ambientLight",
  "lightShadow",
  "ambientLightProbe",
  "hemisphereLightProbe",
  "lightProbe",
  "spotLightHelper",
  "skeletonHelper",
  "pointLightHelper",
  "hemisphereLightHelper",
  "gridHelper",
  "polarGridHelper",
  "directionalLightHelper",
  "cameraHelper",
  "boxHelper",
  "box3Helper",
  "planeHelper",
  "arrowHelper",
  "axesHelper",
  "texture",
  "videoTexture",
  "dataTexture",
  "dataTexture3D",
  "compressedTexture",
  "cubeTexture",
  "canvasTexture",
  "depthTexture",
  "raycaster",
  "vector2",
  "vector3",
  "vector4",
  "euler",
  "matrix3",
  "matrix4",
  "quaternion",
  "bufferAttribute",
  "float16BufferAttribute",
  "float32BufferAttribute",
  "float64BufferAttribute",
  "int8BufferAttribute",
  "int16BufferAttribute",
  "int32BufferAttribute",
  "uint8BufferAttribute",
  "uint16BufferAttribute",
  "uint32BufferAttribute",
  "instancedBufferAttribute",
  "color",
  "fog",
  "fogExp2",
  "shape",
  "colorShiftMaterial"
];
var dreiElems = [
  "AsciiRenderer",
  "Billboard",
  "Clone",
  "ComputedAttribute",
  "Decal",
  "Edges",
  "Effects",
  "GradientTexture",
  "Image",
  "MarchingCubes",
  "Outlines",
  "PositionalAudio",
  "Sampler",
  "ScreenSizer",
  "ScreenSpace",
  "Splat",
  "Svg",
  "Text",
  "Text3D",
  "Trail",
  "CubeCamera",
  "OrthographicCamera",
  "PerspectiveCamera",
  "CameraControls",
  "FaceControls",
  "KeyboardControls",
  "MotionPathControls",
  "PresentationControls",
  "ScrollControls",
  "DragControls",
  "GizmoHelper",
  "Grid",
  "Helper",
  "PivotControls",
  "TransformControls",
  "CubeTexture",
  "Fbx",
  "Gltf",
  "Ktx2",
  "Loader",
  "Progress",
  "ScreenVideoTexture",
  "Texture",
  "TrailTexture",
  "VideoTexture",
  "WebcamVideoTexture",
  "CycleRaycast",
  "DetectGPU",
  "Example",
  "FaceLandmarker",
  "Fbo",
  "Html",
  "Select",
  "SpriteAnimator",
  "StatsGl",
  "Stats",
  "Trail",
  "Wireframe",
  "CurveModifier",
  "AdaptiveDpr",
  "AdaptiveEvents",
  "BakeShadows",
  "Bvh",
  "Detailed",
  "Instances",
  "Merged",
  "meshBounds",
  "PerformanceMonitor",
  "Points",
  "Preload",
  "Segments",
  "Fisheye",
  "Hud",
  "Mask",
  "MeshPortalMaterial",
  "RenderCubeTexture",
  "RenderTexture",
  "View",
  "MeshDiscardMaterial",
  "MeshDistortMaterial",
  "MeshReflectorMaterial",
  "MeshRefractionMaterial",
  "MeshTransmissionMaterial",
  "MeshWobbleMaterial",
  "PointMaterial",
  "shaderMaterial",
  "SoftShadows",
  "CatmullRomLine",
  "CubicBezierLine",
  "Facemesh",
  "Line",
  "Mesh",
  "QuadraticBezierLine",
  "RoundedBox",
  "ScreenQuad",
  "AccumulativeShadows",
  "Backdrop",
  "BBAnchor",
  "Bounds",
  "CameraShake",
  "Caustics",
  "Center",
  "Cloud",
  "ContactShadows",
  "Environment",
  "Float",
  "Lightformer",
  "MatcapTexture",
  "NormalTexture",
  "RandomizedLight",
  "Resize",
  "ShadowAlpha",
  "Shadow",
  "Sky",
  "Sparkles",
  "SpotLightShadow",
  "SpotLight",
  "Stage",
  "Stars",
  "OrbitControls"
];
function shouldTagElement(elementName) {
  return !threeFiberElems.includes(elementName) && !dreiElems.includes(elementName);
}

// src/componentTaggerPlugin.ts
var validExtensions = /* @__PURE__ */ new Set([".jsx", ".tsx"]);
var projectRoot = findProjectRoot();
var tailwindInputFile = path2.resolve(projectRoot, "./tailwind.config.ts");
var tailwindJsonOutfile = path2.resolve(
  projectRoot,
  "./src/tailwind.config.lov.json"
);
var tailwindIntermediateFile = path2.resolve(
  projectRoot,
  "./.lov.tailwind.config.js"
);
var isSandbox = process.env.LOVABLE_DEV_SERVER === "true";
function componentTagger() {
  const cwd = process.cwd();
  const stats = {
    totalFiles: 0,
    processedFiles: 0,
    totalElements: 0
  };
  return {
    name: "vite-plugin-component-tagger",
    enforce: "pre",
    async transform(code, id) {
      if (!validExtensions.has(path2.extname(id)) || id.includes("node_modules")) {
        return null;
      }
      stats.totalFiles++;
      const relativePath = path2.relative(cwd, id);
      try {
        const parserOptions = {
          sourceType: "module",
          plugins: ["jsx", "typescript"]
        };
        const ast = parse(code, parserOptions);
        const magicString = new MagicString(code);
        let changedElementsCount = 0;
        let currentElement = null;
        const { walk } = await import("estree-walker");
        walk(ast, {
          enter(node) {
            if (node.type === "JSXElement") {
              currentElement = node;
            }
            if (node.type === "JSXOpeningElement") {
              const jsxNode = node;
              let elementName;
              if (jsxNode.name.type === "JSXIdentifier") {
                elementName = jsxNode.name.name;
              } else if (jsxNode.name.type === "JSXMemberExpression") {
                const memberExpr = jsxNode.name;
                elementName = `${memberExpr.object.name}.${memberExpr.property.name}`;
              } else {
                return;
              }
              if (elementName === "Fragment" || elementName === "React.Fragment") {
                return;
              }
              const attributes = jsxNode.attributes.reduce((acc, attr) => {
                if (attr.type === "JSXAttribute") {
                  if (attr.value?.type === "StringLiteral") {
                    acc[attr.name.name] = attr.value.value;
                  } else if (attr.value?.type === "JSXExpressionContainer" && attr.value.expression.type === "StringLiteral") {
                    acc[attr.name.name] = attr.value.expression.value;
                  }
                }
                return acc;
              }, {});
              let textContent = "";
              if (currentElement && currentElement.children) {
                textContent = currentElement.children.map((child) => {
                  if (child.type === "JSXText") {
                    return child.value.trim();
                  } else if (child.type === "JSXExpressionContainer") {
                    if (child.expression.type === "StringLiteral") {
                      return child.expression.value;
                    }
                  }
                  return "";
                }).filter(Boolean).join(" ").trim();
              }
              const content = {};
              if (textContent) {
                content.text = textContent;
              }
              if (attributes.placeholder) {
                content.placeholder = attributes.placeholder;
              }
              if (attributes.className) {
                content.className = attributes.className;
              }
              const line = jsxNode.loc?.start?.line ?? 0;
              const col = jsxNode.loc?.start?.column ?? 0;
              const dataComponentId = `${relativePath}:${line}:${col}`;
              const fileName = path2.basename(id);
              const shouldTag = shouldTagElement(elementName);
              if (shouldTag) {
                const legacyIds = ` data-component-path="${relativePath}" data-component-line="${line}" data-component-file="${fileName}" data-component-name="${elementName}" data-component-content="${encodeURIComponent(
                  JSON.stringify(content)
                )}"`;
                magicString.appendLeft(
                  jsxNode.name.end ?? 0,
                  ` data-lov-id="${dataComponentId}" data-lov-name="${elementName}" ${legacyIds}`
                );
                changedElementsCount++;
              }
            }
          }
        });
        stats.processedFiles++;
        stats.totalElements += changedElementsCount;
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ hires: true })
        };
      } catch (error) {
        console.error(`Error processing file ${relativePath}:`, error);
        stats.processedFiles++;
        return null;
      }
    },
    async buildStart() {
      if (!isSandbox)
        return;
      try {
        await generateConfig();
      } catch (error) {
        console.error("Error generating tailwind.config.lov.json:", error);
      }
    },
    configureServer(server) {
      if (!isSandbox)
        return;
      try {
        server.watcher.add(tailwindInputFile);
        server.watcher.on("change", async (changedPath) => {
          if (path2.normalize(changedPath) === path2.normalize(tailwindInputFile)) {
            await generateConfig();
          }
        });
      } catch (error) {
        console.error("Error adding watcher:", error);
      }
    }
  };
}
async function generateConfig() {
  try {
    await esbuild.build({
      entryPoints: [tailwindInputFile],
      outfile: tailwindIntermediateFile,
      bundle: true,
      format: "esm",
      banner: {
        js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
      }
    });
    try {
      const userConfig = await import(
        tailwindIntermediateFile + "?update=" + Date.now()
        // cache buster
      );
      if (!userConfig || !userConfig.default) {
        console.error("Invalid Tailwind config structure:", userConfig);
        throw new Error("Invalid Tailwind config structure");
      }
      const resolvedConfig = resolveConfig(userConfig.default);
      await fs.writeFile(
        tailwindJsonOutfile,
        JSON.stringify(resolvedConfig, null, 2)
      );
      await fs.unlink(tailwindIntermediateFile).catch(() => {
      });
    } catch (error) {
      console.error("Error processing config:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in generateConfig:", error);
    throw error;
  }
}
export {
  componentTagger
};
