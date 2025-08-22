// App.jsx
import React, { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

/* ------- 定数 ------- */
const MAPS = [
  { id: "map1",  thumb: "/img/maps/map1_thumb.png",  full: "/img/maps/map1.png",  label: "ミスラ・アイ" },
  { id: "map2",  thumb: "/img/maps/map2_thumb.png",  full: "/img/maps/map2.png",  label: "雨海の盾" },
  { id: "map3",  thumb: "/img/maps/map3_thumb.png",  full: "/img/maps/map3.png",  label: "パームベイ港" },
  { id: "map4",  thumb: "/img/maps/map4_thumb.png",  full: "/img/maps/map4.png",  label: "龍門発射センター" },
  { id: "map5",  thumb: "/img/maps/map5_thumb.png",  full: "/img/maps/map5.png",  label: "クラオブ陥没抗" },
  { id: "map6",  thumb: "/img/maps/map6_thumb.png",  full: "/img/maps/map6.png",  label: "アーセナル・ポセイドン" },
  { id: "map7",  thumb: "/img/maps/map7_thumb.png",  full: "/img/maps/map7.png",  label: "ブラウン岬天文台" },
  { id: "map8",  thumb: "/img/maps/map8_thumb.png",  full: "/img/maps/map8.png",  label: "ステラ・ウォッチタワー" },
  { id: "map9",  thumb: "/img/maps/map9_thumb.png",  full: "/img/maps/map9.png",  label: "天空都市グレスリン1" },
  { id: "map10", thumb: "/img/maps/map10_thumb.png", full: "/img/maps/map10.png", label: "天空都市グレスリン2" },
  { id: "map11", thumb: "/img/maps/map11_thumb.png", full: "/img/maps/map11.png", label: "天空都市グレスリン3" },
  { id: "map12", thumb: "/img/maps/map12_thumb.png", full: "/img/maps/map12.png", label: "空中要塞バビロン1" },
  { id: "map13", thumb: "/img/maps/map13_thumb.png", full: "/img/maps/map13.png", label: "空中要塞バビロン2" },
  { id: "map14", thumb: "/img/maps/map14_thumb.png", full: "/img/maps/map14.png", label: "空中要塞バビロン3" },
];

// メカ
const MECHS = [
  { id: "mech1",  src: "/img/mechs/mech1.png",  label: "龍淵" },
  { id: "mech2",  src: "/img/mechs/mech2.png",  label: "ファルコン" },
  { id: "mech3",  src: "/img/mechs/mech3.png",  label: "トライセラ" },
  { id: "mech4",  src: "/img/mechs/mech4.png",  label: "赤霄" },
  { id: "mech5",  src: "/img/mechs/mech5.png",  label: "鳴神" },
  { id: "mech6",  src: "/img/mechs/mech6.png",  label: "ハリケーン" },
  { id: "mech7",  src: "/img/mechs/mech7.png",  label: "ルミナ" },
  { id: "mech8",  src: "/img/mechs/mech8.png",  label: "アクイラ" },
  { id: "mech9",  src: "/img/mechs/mech9.png",  label: "ピナカ" },
  { id: "mech10", src: "/img/mechs/mech10.png", label: "スカイレイダー" },
  { id: "mech11", src: "/img/mechs/mech11.png", label: "ステーゴ" },
  { id: "mech12", src: "/img/mechs/mech12.png", label: "パンサー" },
  { id: "mech13", src: "/img/mechs/mech13.png", label: "インフェルノ" },
  { id: "mech14", src: "/img/mechs/mech14.png", label: "飛景" },
  { id: "mech15", src: "/img/mechs/mech15.png", label: "セレニース" },
];

// スキル（24種）
const SKILLS = [
  { id: "skill01", src: "/img/skills/skill01.png", label: "[赤霄]四角バリア" },
  { id: "skill02", src: "/img/skills/skill02.png", label: "[赤霄]腹バリア" },
  { id: "skill03", src: "/img/skills/skill03.png", label: "[赤霄]フラッシュ" },
  { id: "skill04", src: "/img/skills/skill04.png", label: "[ハリ]デコイシールド" },
  { id: "skill05", src: "/img/skills/skill05.png", label: "[ハリ]バリア" },
  { id: "skill06", src: "/img/skills/skill06.png", label: "[ハリ]ビーム" },
  { id: "skill07", src: "/img/skills/skill07.png", label: "[ルミナ]ウィング" },
  { id: "skill08", src: "/img/skills/skill08.png", label: "[ルミナ]範囲ヒール" },
  { id: "skill09", src: "/img/skills/skill09.png", label: "[アクイラ]クロー" },
  { id: "skill10", src: "/img/skills/skill10.png", label: "[ピナカ]壁落とし" },
  { id: "skill11", src: "/img/skills/skill11.png", label: "[ピナカ]バリア" },
  { id: "skill12", src: "/img/skills/skill12.png", label: "[スカレ]ジャミング" },
  { id: "skill13", src: "/img/skills/skill13.png", label: "[ステゴ]煙幕" },
  { id: "skill14", src: "/img/skills/skill14.png", label: "[インフェ]拡散ビーム" },
  { id: "skill15", src: "/img/skills/skill15.png", label: "[インフェ]収束ビーム" },
  { id: "skill16", src: "/img/skills/skill16.png", label: "[セレ]ロック阻害" },
  { id: "skill17", src: "/img/skills/skill17.png", label: "[セレ]ワイヤー" },
  { id: "skill18", src: "/img/skills/skill18.png", label: "[ファルコン]レーダー" },
  { id: "skill19", src: "/img/skills/skill19.png", label: "[ファルコン]ヘビミサ" },
  { id: "skill20", src: "/img/skills/skill20.png", label: "[セラ]榴弾砲" },
  { id: "skill21", src: "/img/skills/skill21.png", label: "[セラ]ヒールドローン" },
  { id: "skill22", src: "/img/skills/skill22.png", label: "[鳴神]ステルス付与" },
  { id: "skill23", src: "/img/skills/skill23.png", label: "[飛景]ソードビット" },
  { id: "skill24", src: "/img/skills/skill24.png", label: "[飛景]ワイヤー" },
];

// その他（12種）
const OTHERS = [
  { id: "other01", src: "/img/others/other01.png", label: "A1" },
  { id: "other02", src: "/img/others/other02.png", label: "A2" },
  { id: "other03", src: "/img/others/other03.png", label: "A3" },
  { id: "other04", src: "/img/others/other04.png", label: "B1" },
  { id: "other05", src: "/img/others/other05.png", label: "B2" },
  { id: "other06", src: "/img/others/other06.png", label: "B3" },
  { id: "other07", src: "/img/others/other07.png", label: "C1" },
  { id: "other08", src: "/img/others/other08.png", label: "C2" },
  { id: "other09", src: "/img/others/other09.png", label: "C3" },
  { id: "other10", src: "/img/others/other10.png", label: "回復ドローン" },
  { id: "other11", src: "/img/others/other11.png", label: "結晶1" },
  { id: "other11", src: "/img/others/other11.png", label: "結晶2" },
];

const MAX_PER_SIDE = 6;
const UNIT_SIZE = 48; // メカの配置基準サイズ
const OBJ_SIZE = 48;  // オブジェクト（スキル/その他）のサイズ
const DEFAULT_VISION_SPREAD = 60;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const dist2 = (x1, y1, x2, y2) => {
  const dx = x1 - x2, dy = y1 - y2;
  return dx * dx + dy * dy;
};

/* 注釈タイプ */
const Tool = {
  Select: "select",
  Line: "line",
  Cone: "cone",
  Paint: "paint",
  Erase: "erase",
};

export default function App() {
  const mapRef = useRef(null);

  const [currentMapId, setCurrentMapId] = useState(MAPS[0].id);
  const currentMap = useMemo(
    () => MAPS.find((m) => m.id === currentMapId) ?? MAPS[0],
    [currentMapId]
  );

  // タブ（右側）
  const [activeTab, setActiveTab] = useState("mech"); // "mech" | "skill" | "other"

  // メカ
  const [mode, setMode] = useState("ally"); // 'ally' | 'enemy'
  const [units, setUnits] = useState({ ally: [], enemy: [] }); // {id,src,label,side,x,y}[]
  const allyCount = units.ally.length;
  const enemyCount = units.enemy.length;

  // オブジェクト（スキル/その他 共通）
  // {id, kind:"skill"|"other", src, label, x, y}
  const [objects, setObjects] = useState([]);

  const [dragPreview, setDragPreview] = useState(null);
  const [isDraggingUnit, setIsDraggingUnit] = useState(false);

  const isPlacedInCurrentSide = (mechId) =>
    units[mode].some((u) => u.id === mechId);

  const handleChangeMap = (mapId) => {
    setCurrentMapId(mapId);
    setUnits({ ally: [], enemy: [] });
    setObjects([]);
    clearAnnotations();
  };

  /* ================= 注釈（アノテーション） ================ */
  const [tool, setTool] = useState(Tool.Select);

  const LINE_BLUE = "rgba(56,189,248,0.95)";
  const LINE_RED  = "rgba(248,113,113,0.95)";
  const CONE_BLUE = "rgba(56,189,248,0.85)";
  const CONE_RED  = "rgba(248,113,113,0.85)";

  const lineColorByMode = mode === "ally" ? LINE_BLUE : LINE_RED;
  const coneColorByMode = mode === "ally" ? CONE_BLUE : CONE_RED;

  const [settings, setSettings] = useState({
    lineColor: LINE_BLUE,
    coneColor: CONE_BLUE,
    paintColor: "rgba(255,255,255,0.9)",
    visionSpread: DEFAULT_VISION_SPREAD,
  });

  const [lines, setLines] = useState([]);
  const [cones, setCones] = useState([]);
  const [strokes, setStrokes] = useState([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPt, setStartPt] = useState(null);
  const [cursor, setCursor] = useState(null);

  const [selected, setSelected] = useState(null); // {kind,index}
  const [dragMode, setDragMode] = useState(null); // 'move'|'rotate'

  const annotationStack = useRef([]);
  const pushHistory = (kind) => annotationStack.current.push(kind);
  const undo = () => {
    const last = annotationStack.current.pop();
       if (!last) return;
    if (last === "line") setLines((arr) => arr.slice(0, -1));
    if (last === "cone") setCones((arr) => arr.slice(0, -1));
    if (last === "stroke") setStrokes((arr) => arr.slice(0, -1));
  };
  const clearAnnotations = () => {
    setLines([]); setCones([]); setStrokes([]);
    annotationStack.current = [];
    setSelected(null);
  };

  const toMapCoords = (clientX, clientY) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clamp(clientX - rect.left, 0, rect.width),
      y: clamp(clientY - rect.top, 0, rect.height),
    };
  };

  /* ====== 注釈ツール：描画/編集 ====== */
  const onMapMouseDown = (e) => {
    if (e.button !== 0) return;
    const pt = toMapCoords(e.clientX, e.clientY);
    if (!pt) return;

    if (tool === Tool.Select) {
      const coneHit = hitConeHandle(cones, pt);
      if (coneHit) {
        setSelected({ kind: "cone", index: coneHit.index });
        setDragMode("rotate");
        setIsDrawing(true);
        return;
      }
      const hit = hitAnnotation({ pt, lines, cones, strokes });
      if (hit) {
        setSelected(hit);
        setDragMode("move");
        setIsDrawing(true);
      } else {
        setSelected(null);
      }
      return;
    }

    if (tool === Tool.Line || tool === Tool.Cone) {
      setStartPt(pt);
      setCursor(pt);
      setIsDrawing(true);
    } else if (tool === Tool.Paint) {
      setIsDrawing(true);
      setStrokes((arr) => [...arr, { points: [pt], color: settings.paintColor }]);
    } else if (tool === Tool.Erase) {
      eraseNearest(pt, { lines, setLines, cones, setCones, strokes, setStrokes });
    }
  };

  const onMapMouseMove = (e) => {
    const pt = toMapCoords(e.clientX, e.clientY);
    if (!pt) return;

    if (tool === Tool.Select && isDrawing && selected) {
      const dx = e.movementX;
      const dy = e.movementY;

      if (dragMode === "move") {
        if (selected.kind === "line") {
          setLines((arr) => moveLine(arr, selected.index, dx, dy));
        } else if (selected.kind === "cone") {
          setCones((arr) => moveCone(arr, selected.index, dx, dy));
        } else if (selected.kind === "stroke") {
          setStrokes((arr) => moveStroke(arr, selected.index, dx, dy));
        }
      } else if (dragMode === "rotate" && selected.kind === "cone") {
        const c = cones[selected.index];
        const ang = Math.atan2(pt.y - c.y, pt.x - c.x);
        setCones((arr) => {
          const next = [...arr];
          next[selected.index] = { ...c, angle: ang };
          return next;
        });
      }
      return;
    }

    if (isDrawing && (tool === Tool.Line || tool === Tool.Cone)) {
      setCursor(pt);
    } else if (isDrawing && tool === Tool.Paint) {
      setStrokes((arr) => {
        if (arr.length === 0) return arr;
        const last = arr[arr.length - 1];
        const updated = { ...last, points: [...last.points, pt] };
        return [...arr.slice(0, -1), updated];
      });
    }
  };

  const onMapMouseUp = () => {
    const pt = cursor;
    if (tool === Tool.Select) {
      setIsDrawing(false);
      setDragMode(null);
      return;
    }
    if (!isDrawing) return;
    setIsDrawing(false);

    if ((tool === Tool.Line || tool === Tool.Cone) && startPt && pt) {
      if (tool === Tool.Line) {
        const color = lineColorByMode;
        setLines((arr) => [...arr, { x1: startPt.x, y1: startPt.y, x2: pt.x, y2: pt.y, color }]);
        pushHistory("line");
      } else if (tool === Tool.Cone) {
        const dx = pt.x - startPt.x;
        const dy = pt.y - startPt.y;
        const angle = Math.atan2(dy, dx);
        const length = Math.max(24, Math.hypot(dx, dy));
        const color = coneColorByMode;
        setCones((arr) => [
          ...arr,
          { x: startPt.x, y: startPt.y, angle, length, spread: settings.visionSpread, color },
        ]);
        pushHistory("cone");
      }
    } else if (tool === Tool.Paint) {
      pushHistory("stroke");
    }

    setStartPt(null);
    setCursor(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const pt = toMapCoords(e.clientX, e.clientY);
    if (!pt) return;
    const hit = hitAnnotation({ pt, lines, cones, strokes });
    if (!hit) return;

    if (hit.kind === "line")   setLines((arr) => arr.filter((_, i) => i !== hit.index));
    if (hit.kind === "cone")   setCones((arr) => arr.filter((_, i) => i !== hit.index));
    if (hit.kind === "stroke") setStrokes((arr) => arr.filter((_, i) => i !== hit.index));

    if (selected && selected.kind === hit.kind && selected.index === hit.index) {
      setSelected(null);
    }
  };

  const dndLocked = isDrawing && tool !== Tool.Select;

  /* ============== DnD Context（ユニット+オブジェクト用） ============== */
  return (
    <DndContext
      onDragStart={({ active }) => {
        const data = active.data?.current;
        if (!data || dndLocked) return;

        // プレビュー
        if (data.type === "palette-mech" || data.type === "unit" ||
            data.type === "palette-obj"  || data.type === "obj") {
          setIsDraggingUnit(true);
        }
        if (data.type === "palette-mech") setDragPreview({ src: data.mech.src, label: data.mech.label });
        if (data.type === "unit")         setDragPreview({ src: data.src, label: data.label });
        if (data.type === "palette-obj")  setDragPreview({ src: data.item.src, label: data.item.label });
        if (data.type === "obj")          setDragPreview({ src: data.src, label: data.label });
      }}
      onDragEnd={({ active, over, delta }) => {
        const data = active.data?.current;
        setDragPreview(null);
        setIsDraggingUnit(false);
        if (!data || dndLocked) return;

        const dropOnMap = over?.id === "map";
        const dropOnTrash = over?.id === "trash";

        // パレット -> マップ
        if (data.type === "palette-mech" && dropOnMap) {
          const dragRect = active.rect?.current?.translated || active.rect?.current?.initial;
          const centerX = (dragRect?.left ?? 0) + (dragRect?.width ?? 0) / 2;
          const centerY = (dragRect?.top ?? 0) + (dragRect?.height ?? 0) / 2;
          addUnitAt(data.mech, mode, centerX, centerY);
          return;
        }
        if (data.type === "palette-obj" && dropOnMap) {
          const dragRect = active.rect?.current?.translated || active.rect?.current?.initial;
          const centerX = (dragRect?.left ?? 0) + (dragRect?.width ?? 0) / 2;
          const centerY = (dragRect?.top ?? 0) + (dragRect?.height ?? 0) / 2;
          addObjectAt(data.item, centerX, centerY);
          return;
        }

        // 既存 -> 移動/削除
        if (data.type === "unit") {
          if (dropOnTrash) {
            deleteUnit(data.id, data.side);
            return;
          }
          moveUnitTo(data.id, data.side, data.x + delta.x, data.y + delta.y);
          return;
        }
        if (data.type === "obj") {
          if (dropOnTrash) {
            deleteObject(data.id);
            return;
          }
          moveObjectTo(data.id, data.x + delta.x, data.y + delta.y);
          return;
        }
      }}
      onDragCancel={() => {
        setDragPreview(null);
        setIsDraggingUnit(false);
      }}
    >
      <div className="flex h-screen gap-3 px-3 py-2 bg-[#0f1114] text-white select-none">
        {/* ------------ 左：マップ一覧 ------------ */}
        <aside className="w-[300px] bg-gradient-to-b from-[#202428] to-[#14161a] rounded-xl p-4 flex flex-col items-center overflow-auto shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
          <h3 className="text-cyan-300/90 text-[16px] font-semibold mb-2 tracking-wide">Maps</h3>
          {MAPS.map((m) => (
            <MapThumb
              key={m.id}
              map={m}
              active={m.id === currentMapId}
              onClick={() => handleChangeMap(m.id)}
            />
          ))}
        </aside>

        {/* ------------ 中央：マップ（ツールバー＋注釈SVG＋配置要素） ------------ */}
        <section className="flex-1 min-w-[420px] min-h-[420px] rounded-xl border border-white/10 relative overflow-hidden bg-[#1e2328] shadow-inner">
          {/* Toolbar */}
          <div className="absolute top-0 left-0 right-0 z-40 h-12 px-3 md:px-4 flex items-center justify-between gap-2 bg-black/35 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-white/70">Current Map</span>
              <strong className="text-sm">{currentMap.label}</strong>
              <CountBadge label="味方" count={allyCount} max={MAX_PER_SIDE} color="blue" />
              <CountBadge label="敵" count={enemyCount} max={MAX_PER_SIDE} color="red" />
            </div>

            <div className="flex items-center gap-2">
              <ToolButton active={tool===Tool.Select} onClick={()=>setTool(Tool.Select)} title="選択/編集 (ドラッグ移動・回転)">
                🖱️
              </ToolButton>
              <ToolButton active={tool===Tool.Line} onClick={()=>setTool(Tool.Line)} title="射線（ドラッグ）">
                ➖
              </ToolButton>
              <ToolButton active={tool===Tool.Cone} onClick={()=>setTool(Tool.Cone)} title="視界（ドラッグ）">
                ◢
              </ToolButton>
              <ToolButton active={tool===Tool.Paint} onClick={()=>setTool(Tool.Paint)} title="ペイント（ドラッグ）">
                🖊️
              </ToolButton>
              <ToolButton active={tool===Tool.Erase} onClick={()=>setTool(Tool.Erase)} title="消しゴム（クリック削除）">
                ⌫
              </ToolButton>

              {/* 表示のみ（色はモードで固定） */}
              <label className="flex items-center gap-1 text-[11px]">
                線色
                <input type="color" value={rgbaToHex(lineColorByMode)} disabled className="w-6 h-6 rounded border border-white/20 bg-transparent opacity-60 cursor-not-allowed" />
              </label>
              <label className="flex items-center gap-1 text-[11px]">
                視界色
                <input type="color" value={rgbaToHex(coneColorByMode)} disabled className="w-6 h-6 rounded border border-white/20 bg-transparent opacity-60 cursor-not-allowed" />
              </label>
              <label className="hidden md:flex items-center gap-1 text-[11px] w-[160px]">
                角度
                <input
                  type="range" min="20" max="120" step="1"
                  value={settings.visionSpread}
                  onChange={(e)=>applySettingAndMaybeUpdateSelected({ visionSpread: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="w-8 text-right">{settings.visionSpread}°</span>
              </label>

              <button onClick={undo} className="px-2 py-1 text-[11px] rounded bg-zinc-700 hover:bg-zinc-600">Undo</button>
              <button onClick={clearAnnotations} className="px-2 py-1 text-[11px] rounded bg-zinc-700 hover:bg-zinc-600">Clear</button>
            </div>
          </div>

          {/* Map Stage */}
          <MapStage ref={mapRef} map={currentMap} onContextMenu={handleContextMenu}>
            {/* 注釈レイヤ */}
            <svg
              className="absolute inset-0 z-10 w-full h-full"
              style={{ touchAction: "none" }}
              width="100%"
              height="100%"
              onMouseDown={onMapMouseDown}
              onMouseMove={onMapMouseMove}
              onMouseUp={onMapMouseUp}
              onContextMenu={handleContextMenu}
            >
              {/* 既存線 */}
              {lines.map((ln, i) => {
                const sel = selected && selected.kind==="line" && selected.index===i;
                return (
                  <g key={`ln-${i}`}>
                    <line x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
                      stroke={ln.color} strokeWidth="3" strokeLinecap="round" opacity="0.95" />
                    {sel && (
                      <>
                        <circle cx={(ln.x1+ln.x2)/2} cy={(ln.y1+ln.y2)/2} r="6" fill="white" opacity="0.9" />
                        <circle cx={ln.x1} cy={ln.y1} r="4" fill="white" opacity="0.6" />
                        <circle cx={ln.x2} cy={ln.y2} r="4" fill="white" opacity="0.6" />
                      </>
                    )}
                  </g>
                );
              })}

              {/* 線プレビュー */}
              {isDrawing && tool===Tool.Line && startPt && cursor && (
                <line
                  x1={startPt.x}
                  y1={startPt.y}
                  x2={cursor.x}
                  y2={cursor.y}
                  stroke={mode === "ally" ? "rgba(56,189,248,0.7)" : "rgba(248,113,113,0.7)"}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              )}

              {/* 視界（扇形） */}
              {cones.map((c, i) => {
                const sel = selected && selected.kind==="cone" && selected.index===i;
                const stroke = hexOrRgbaStroke(c.color ?? coneColorByMode);
                const fill = coneFillFromStroke(stroke);
                const handle = coneHandlePoint(c);
                return (
                  <g key={`cone-${i}`}>
                    <path d={conePath(c)} fill={fill} stroke={stroke} strokeWidth={sel?3:2} />
                    <circle cx={handle.x} cy={handle.y} r="7" fill="white" opacity={sel?0.95:0.75} />
                    {sel && <circle cx={c.x} cy={c.y} r="5" fill="white" opacity="0.9" />}
                  </g>
                );
              })}

              {/* 視界プレビュー */}
              {isDrawing && tool===Tool.Cone && startPt && cursor && (
                <path
                  d={conePath({
                    x:startPt.x, y:startPt.y,
                    angle:Math.atan2(cursor.y-startPt.y, cursor.x-startPt.x),
                    length:Math.hypot(cursor.x-startPt.x, cursor.y-startPt.y),
                    spread: settings.visionSpread
                  })}
                  fill={coneFillFromStroke(coneColorByMode)}
                  stroke={coneColorByMode}
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  opacity="0.9"
                />
              )}

              {/* ペイント */}
              {strokes.map((s, i) => {
                const sel = selected && selected.kind==="stroke" && selected.index===i;
                return (
                  <polyline key={`st-${i}`} points={s.points.map(p=>`${p.x},${p.y}`).join(" ")}
                    fill="none" stroke={s.color ?? settings.paintColor} strokeWidth={sel?3.5:2.5} strokeLinecap="round" strokeLinejoin="round" />
                );
              })}
            </svg>

            {/* DnD 受け口（マップ） */}
            <Droppable id="map" className="absolute inset-0 z-0 pointer-events-none" />

            {/* ユニット（メカ） */}
            <div className="pointer-events-auto">
              {["ally", "enemy"].flatMap((side) =>
                units[side].map((u) => <MapUnit key={`${side}-${u.id}`} unit={u} dndLocked={dndLocked} />)
              )}
            </div>

            {/* オブジェクト（スキル/その他） */}
            <div className="pointer-events-auto">
              {objects.map((o) => (
                <MapObject key={o.id} obj={o} />
              ))}
            </div>

            {/* DnDプレビュー */}
            <DragOverlay>
              {dragPreview ? (
                <img
                  src={dragPreview.src}
                  alt={dragPreview.label}
                  className="w-16 h-16 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                />
              ) : null}
            </DragOverlay>
          </MapStage>
        </section>

        {/* ------------ 右：パレット（タブ切り替え） + ゴミ箱 ------------ */}
        <aside className="w-[360px] bg-gradient-to-b from-[#202428] to-[#14161a] rounded-xl p-4 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-amber-300/90 text-[15px] font-semibold tracking-wide">Palette</h3>
            {/* 味方/敵 切替はメカのみ意味があるので常に表示（配置時に参照） */}
            <div className="flex gap-1">
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${mode === "ally" ? "bg-blue-600 hover:bg-blue-500" : "bg-zinc-700 hover:bg-zinc-600"}`}
                onClick={() => setMode("ally")}
                title="味方配置モード"
              >
                味方
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${mode === "enemy" ? "bg-red-600 hover:bg-red-500" : "bg-zinc-700 hover:bg-zinc-600"}`}
                onClick={() => setMode("enemy")}
                title="敵配置モード"
              >
                敵
              </button>
            </div>
          </div>

          {/* タブ：メカ／スキル／その他 */}
          <div className="flex gap-1 mb-3">
            <TabButton active={activeTab==="mech"}  onClick={()=>setActiveTab("mech")}>メカ</TabButton>
            <TabButton active={activeTab==="skill"} onClick={()=>setActiveTab("skill")}>スキル</TabButton>
            <TabButton active={activeTab==="other"} onClick={()=>setActiveTab("other")}>その他</TabButton>
          </div>

          {/* タブの中身 */}
          {activeTab === "mech" && (
            <div className="grid grid-cols-3 gap-1.5 overflow-auto">
              {MECHS.map((mech) => (
                <PaletteMech
                  key={mech.id}
                  mech={mech}
                  disabled={isPlacedInCurrentSide(mech.id) || dndLocked}
                />
              ))}
            </div>
          )}

          {activeTab === "skill" && (
            <div className="grid grid-cols-3 gap-1.5 overflow-auto">
              {SKILLS.map((item) => (
                <PaletteObj key={item.id} item={{ ...item, kind: "skill" }} disabled={dndLocked} />
              ))}
            </div>
          )}

          {activeTab === "other" && (
            <div className="grid grid-cols-3 gap-1.5 overflow-auto">
              {OTHERS.map((item) => (
                <PaletteObj key={item.id} item={{ ...item, kind: "other" }} disabled={dndLocked} />
              ))}
            </div>
          )}

          <TrashBin />
        </aside>
      </div>
    </DndContext>
  );

  /* ------ メカ：配置/移動/削除 ------ */
  function addUnitAt(mech, side, clientX, clientY) {
    if (units[side].length >= MAX_PER_SIDE) {
      alert(`${side === "ally" ? "味方" : "敵"}は最大 ${MAX_PER_SIDE} 機までです`);
      return;
    }
    if (units[side].some((u) => u.id === mech.id)) {
      alert("同じメカは同一陣営に重複配置できません");
      return;
    }
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clamp(clientX - rect.left - UNIT_SIZE / 2, 0, rect.width - UNIT_SIZE);
    const y = clamp(clientY - rect.top - UNIT_SIZE / 2, 0, rect.height - UNIT_SIZE);

    setUnits((prev) => ({
      ...prev,
      [side]: [...prev[side], { id: mech.id, src: mech.src, label: mech.label, side, x, y }],
    }));
  }
  function moveUnitTo(id, side, x, y) {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = clamp(x, 0, rect.width - UNIT_SIZE);
    const ny = clamp(y, 0, rect.height - UNIT_SIZE);
    setUnits((prev) => ({
      ...prev,
      [side]: prev[side].map((u) => (u.id === id ? { ...u, x: nx, y: ny } : u)),
    }));
  }
  function deleteUnit(id, side) {
    setUnits((prev) => ({
      ...prev,
      [side]: prev[side].filter((u) => u.id !== id),
    }));
  }

  /* ------ オブジェクト：配置/移動/削除 ------ */
  function addObjectAt(item, clientX, clientY) {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clamp(clientX - rect.left - OBJ_SIZE / 2, 0, rect.width - OBJ_SIZE);
    const y = clamp(clientY - rect.top - OBJ_SIZE / 2, 0, rect.height - OBJ_SIZE);

    // 同一IDの重複配置を許す（IDに連番を付けてユニーク化）
    const uid = `${item.id}_${Date.now()}_${Math.floor(Math.random()*1000)}`;

    setObjects((prev) => [
      ...prev,
      { id: uid, kind: item.kind, src: item.src, label: item.label, x, y },
    ]);
  }
  function moveObjectTo(id, x, y) {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = clamp(x, 0, rect.width - OBJ_SIZE);
    const ny = clamp(y, 0, rect.height - OBJ_SIZE);
    setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, x: nx, y: ny } : o)));
  }
  function deleteObject(id) {
    setObjects((prev) => prev.filter((o) => o.id !== id));
  }

  function applySettingAndMaybeUpdateSelected(next) {
    setSettings((cur) => ({ ...cur, ...next }));
  }
}

/* ================= ツールUI小物 ================= */
function ToolButton({ active, onClick, title, children }) {
  return (
    <button
      className={`w-8 h-8 text-[14px] rounded-md border transition grid place-items-center
        ${active ? "bg-cyan-600 border-cyan-400" : "bg-zinc-700 border-zinc-600 hover:bg-zinc-600"}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold transition
        ${active ? "bg-zinc-600" : "bg-zinc-800 hover:bg-zinc-700"}`}
    >
      {children}
    </button>
  );
}

function CountBadge({ label, count, max, color = "blue" }) {
  const base = "px-2 py-1 rounded-md text-[11px] font-semibold border backdrop-blur-sm";
  const theme =
    color === "blue"
      ? count >= max
        ? "bg-blue-500/20 border-blue-400/50 text-blue-200"
        : "bg-blue-500/10 border-blue-400/30 text-blue-200"
      : count >= max
      ? "bg-red-500/20 border-red-400/50 text-red-200"
      : "bg-red-500/10 border-red-400/30 text-red-200";
  return <div className={`${base} ${theme}`}>{label}: {count}/{max}</div>;
}

function MapThumb({ map, active, onClick }) {
  return (
    <div className="mb-3">
      <img
        src={map.thumb}
        alt={map.label}
        onClick={onClick}
        className={`w-[260px] h-[120px] object-cover rounded-lg cursor-pointer border-2 transition
          ${active ? "border-cyan-400 shadow-[0_0_0_2px_rgba(0,255,255,0.15)]" : "border-white/10 hover:border-cyan-300"}`}
      />
      <div className="text-center text-xs text-white/70 mt-1">{map.label}</div>
    </div>
  );
}

const MapStage = React.forwardRef(function MapStage({ map, onContextMenu, children }, ref) {
  return (
    <main
      ref={ref}
      onContextMenu={onContextMenu}
      className="h-full w-full pt-12 relative"
      style={{
        backgroundImage: `url(${map.full})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minWidth: 420,
        minHeight: 420,
      }}
    >
      {children}
    </main>
  );
});

function Droppable({ id, className = "" }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? "outline outline-2 outline-cyan-400/40" : ""}`} />
  );
}

/* ---- 右パレット：メカ ---- */
function PaletteMech({ mech, disabled }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette:${mech.id}`,
    data: { type: "palette-mech", mech },
    disabled,
  });
  const style =
    transform && !disabled
      ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
      : undefined;

  return (
    <div
      ref={setNodeRef}
      {...(!disabled ? { ...attributes, ...listeners } : {})}
      style={style}
      className={`w-[92px] h-[92px] rounded-lg bg-[#1f2629] border border-white/10
        flex flex-col items-center justify-center cursor-grab transition
        hover:border-cyan-400/60 ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      title={mech.label}
    >
      <img
        src={mech.src}
        alt={mech.label}
        className="w-[60px] h-[60px] object-contain rounded-md bg-[#121417]"
        draggable={false}
      />
      <div className="text-[10px] mt-1 text-white/85 leading-none">{mech.label}</div>
    </div>
  );
}

/* ---- 右パレット：スキル/その他 共通 ---- */
function PaletteObj({ item, disabled }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette:${item.id}`,
    data: { type: "palette-obj", item }, // item.kind: "skill" | "other"
    disabled,
  });
  const style =
    transform && !disabled
      ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
      : undefined;

  return (
    <div
      ref={setNodeRef}
      {...(!disabled ? { ...attributes, ...listeners } : {})}
      style={style}
      className={`w-[92px] h-[92px] rounded-lg bg-[#1f2629] border border-white/10
        flex flex-col items-center justify-center cursor-grab transition
        hover:border-amber-400/60 ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      title={item.label}
    >
      <img
        src={item.src}
        alt={item.label}
        className="w-[60px] h-[60px] object-contain rounded-md bg-[#121417]"
        draggable={false}
      />
      <div className="text-[10px] mt-1 text-white/85 leading-none">{item.label}</div>
    </div>
  );
}

/* ---- マップ上：メカ（小型アイコン） ---- */
function MapUnit({ unit, dndLocked }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `unit:${unit.side}:${unit.id}`,
    data: {
      type: "unit",
      id: unit.id,
      side: unit.side,
      x: unit.x,
      y: unit.y,
      src: unit.src,
      label: unit.label,
    },
    disabled: dndLocked,
  });

  const style = {
    left: unit.x,
    top: unit.y,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const sideTheme =
    unit.side === "ally"
      ? "border-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.35)]"
      : "border-red-500  shadow-[0_0_10px_rgba(248,113,113,0.35)]";

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`absolute z-20 w-[56px] h-[56px] rounded-xl border-2 bg-black/30 backdrop-blur-[2px]
        grid place-items-center cursor-grab select-none ${sideTheme}`}
      style={style}
      title={`${unit.label} — ${unit.side === "ally" ? "味方" : "敵"}`}
    >
      <img
        src={unit.src}
        alt={unit.label}
        className="w-[48px] h-[48px] object-contain pointer-events-none rounded-md"
        draggable={false}
      />
    </div>
  );
}

/* ---- マップ上：オブジェクト（スキル/その他 共通） ---- */
function MapObject({ obj }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `obj:${obj.id}`,
    data: {
      type: "obj",
      id: obj.id,
      x: obj.x,
      y: obj.y,
      src: obj.src,
      label: obj.label,
      kind: obj.kind,
    },
  });

  const style = {
    left: obj.x,
    top: obj.y,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const ring =
    obj.kind === "skill"
      ? "border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.35)]"
      : "border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.35)]";

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`absolute z-20 w-[56px] h-[56px] rounded-xl border-2 bg-black/30 backdrop-blur-[2px]
        grid place-items-center cursor-grab select-none ${ring}`}
      style={style}
      title={`${obj.label} — ${obj.kind === "skill" ? "スキル" : "その他"}`}
    >
      <img
        src={obj.src}
        alt={obj.label}
        className="w-[48px] h-[48px] object-contain pointer-events-none rounded-md"
        draggable={false}
      />
    </div>
  );
}

/* ---- ゴミ箱（ユニット＆オブジェクト削除） ---- */
function TrashBin() {
  const { isOver, setNodeRef } = useDroppable({ id: "trash" });
  return (
    <div
      ref={setNodeRef}
      className={`mt-3 h-14 rounded-lg flex items-center justify-center border-2 border-dashed transition
        ${isOver ? "bg-red-600/75 border-red-200 text-white" : "bg-[#3a2a2a] border-white/20 text-white"}`}
      title="ここにドロップで削除（メカ/スキル/その他）"
    >
      🗑️
    </div>
  );
}

/* ==================== 注釈：選択/移動/回転ユーティリティ ==================== */
function moveLine(arr, index, dx, dy) {
  const next = [...arr];
  const ln = next[index];
  next[index] = { ...ln, x1: ln.x1 + dx, y1: ln.y1 + dy, x2: ln.x2 + dx, y2: ln.y2 + dy };
  return next;
}
function moveCone(arr, index, dx, dy) {
  const next = [...arr];
  const c = next[index];
  next[index] = { ...c, x: c.x + dx, y: c.y + dy };
  return next;
}
function moveStroke(arr, index, dx, dy) {
  const next = [...arr];
  const s = next[index];
  next[index] = { ...s, points: s.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
  return next;
}

/* ヒットテスト */
function hitAnnotation({ pt, lines, cones, strokes }) {
  const tol = 8;

  for (let i = lines.length - 1; i >= 0; i--) {
    const ln = lines[i];
    if (pointNearSegment(pt.x, pt.y, ln.x1, ln.y1, ln.x2, ln.y2, tol)) {
      return { kind: "line", index: i };
    }
  }
  for (let i = cones.length - 1; i >= 0; i--) {
    if (pointInCone(pt.x, pt.y, cones[i])) {
      return { kind: "cone", index: i };
    }
  }
  for (let i = strokes.length - 1; i >= 0; i--) {
    if (nearPolyline(pt.x, pt.y, strokes[i].points, tol)) {
      return { kind: "stroke", index: i };
    }
  }
  return null;
}
function hitConeHandle(cones, pt) {
  const tol2 = 10 * 10;
  for (let i = cones.length - 1; i >= 0; i--) {
    const h = coneHandlePoint(cones[i]);
    if (dist2(pt.x, pt.y, h.x, h.y) < tol2) return { index: i };
  }
  return null;
}
function pointNearSegment(px, py, x1, y1, x2, y2, tol = 6) {
  const vx = x2 - x1, vy = y2 - y1;
  const wx = px - x1, wy = py - y1;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return Math.hypot(px - x1, py - y1) <= tol;
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(px - x2, py - y2) <= tol;
  const b = c1 / c2;
  const bx = x1 + b * vx, by = y1 + b * vy;
  return Math.hypot(px - bx, py - by) <= tol;
}
function pointInCone(px, py, cone) {
  const dx = px - cone.x;
  const dy = py - cone.y;
  const r = Math.hypot(dx, dy);
  if (r > cone.length) return false;

  const ang = Math.atan2(dy, dx);
  const half = (cone.spread * Math.PI) / 180 / 2;
  const d = angleDelta(ang, cone.angle);
  return Math.abs(d) <= half;
}
function angleDelta(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
function nearPolyline(px, py, pts, tol = 8) {
  if (!pts || pts.length === 0) return false;
  if (pts.length === 1) {
    return Math.hypot(px - pts[0].x, py - pts[0].y) <= tol;
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (pointNearSegment(px, py, a.x, a.y, b.x, b.y, tol)) return true;
  }
  return false;
}

/* ================= SVG ユーティリティ ================= */
function conePath({ x, y, angle, length, spread }) {
  const half = (spread * Math.PI) / 180 / 2;
  const a1 = angle - half;
  const a2 = angle + half;
  const x1 = x + Math.cos(a1) * length;
  const y1 = y + Math.sin(a1) * length;
  const x2 = x + Math.cos(a2) * length;
  const y2 = y + Math.sin(a2) * length;
  return `M ${x} ${y} L ${x1} ${y1} A ${length} ${length} 0 0 1 ${x2} ${y2} Z`;
}
function coneHandlePoint(c) {
  const hx = c.x + Math.cos(c.angle) * c.length;
  const hy = c.y + Math.sin(c.angle) * c.length;
  return { x: hx, y: hy };
}
function rgbaToHex(rgba) {
  if (rgba.startsWith("#")) return rgba;
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return "#ffffff";
  const r = Number(m[1]).toString(16).padStart(2,"0");
  const g = Number(m[2]).toString(16).padStart(2,"0");
  const b = Number(m[3]).toString(16).padStart(2,"0");
  return `#${r}${g}${b}`;
}
function hexOrRgbaStroke(color) {
  return color?.startsWith("#") ? color : (color ?? "rgba(255,215,0,0.75)");
}
function coneFillFromStroke(stroke) {
  if (stroke.startsWith("#")) {
    const r = parseInt(stroke.slice(1,3),16);
    const g = parseInt(stroke.slice(3,5),16);
    const b = parseInt(stroke.slice(5,7),16);
    return `rgba(${r},${g},${b},0.18)`;
  }
  const m = stroke.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return "rgba(255,215,0,0.18)";
  return `rgba(${m[1]},${m[2]},${m[3]},0.18)`;
}

/* ================= 消しゴム（最寄り削除） ================= */
function eraseNearest(pt, { lines, setLines, cones, setCones, strokes, setStrokes }) {
  const cand = [];
  const tol = 10;

  lines.forEach((ln, i) => {
    const d = distanceToSegment(pt.x, pt.y, ln.x1, ln.y1, ln.x2, ln.y2);
    cand.push({ kind: "line", index: i, d });
  });
  cones.forEach((c, i) => {
    const inside = pointInCone(pt.x, pt.y, c);
    const d = Math.hypot(pt.x - c.x, pt.y - c.y) * (inside ? 0.5 : 1);
    cand.push({ kind: "cone", index: i, d });
  });
  strokes.forEach((s, i) => {
    let best = Infinity;
    for (let k = 0; k < s.points.length - 1; k++) {
      const a = s.points[k], b = s.points[k+1];
      best = Math.min(best, distanceToSegment(pt.x, pt.y, a.x, a.y, b.x, b.y));
    }
    cand.push({ kind: "stroke", index: i, d: best });
  });

  cand.sort((a,b)=>a.d-b.d);
  const hit = cand[0];
  if (!hit || hit.d > tol) return;

  if (hit.kind === "line")  setLines(arr => arr.filter((_,i)=>i!==hit.index));
  if (hit.kind === "cone")  setCones(arr => arr.filter((_,i)=>i!==hit.index));
  if (hit.kind === "stroke")setStrokes(arr => arr.filter((_,i)=>i!==hit.index));
}
function distanceToSegment(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1, vy = y2 - y1;
  const wx = px - x1, wy = py - y1;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return Math.hypot(px - x1, py - y1);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(px - x2, py - y2);
  const b = c1 / c2;
  const bx = x1 + b * vx, by = y1 + b * vy;
  return Math.hypot(px - bx, py - by);
}
