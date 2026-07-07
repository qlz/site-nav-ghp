type RouteMode = "url" | "upload";

type RouteItem = {
  id: string;
  mode: RouteMode;
  type: string;
  title: string;
  description: string;
  address: string;
  url: string | null;
  sourceName: string;
  filePath: string | null;
  topic: string;
  subtopic: string;
  groupLabel: string;
  groupId: string;
  classificationStatus: string;
  manualClassification: boolean;
  uploadedAt: string;
  lastAccessedAt: string | null;
  renamedAt: string | null;
  reviewedAt: string | null;
};

type TaxonomyMap = Record<string, string[]>;

type SupabaseRouteRecord = {
  id: string;
  mode: RouteMode;
  type: string | null;
  title: string | null;
  description: string | null;
  address: string | null;
  url: string | null;
  source_name: string | null;
  file_path: string | null;
  topic: string | null;
  subtopic: string | null;
  group_label: string | null;
  group_id: string | null;
  classification_status: string | null;
  manual_classification: boolean | null;
  uploaded_at: string | null;
  last_accessed_at: string | null;
  renamed_at: string | null;
  reviewed_at: string | null;
};

type TaxonomyRecord = {
  topic: string;
  subtopic: string;
};

const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_ANON_KEY = String(import.meta.env.VITE_SUPABASE_ANON_KEY || "");
const STORAGE_BUCKET = String(import.meta.env.VITE_SUPABASE_UPLOADS_BUCKET || "uploads");
const LOCAL_COLLAPSE_KEY = "siteNavigator.collapsedGroups.v1";
const DEFAULT_TOPIC_ORDER = ["Matcha", "Travel", "Study", "Smoothie", "Misc"];
const DEFAULT_TAXONOMY: TaxonomyMap = {
  Matcha: ["Uji / tea brands", "Local cafe/matcha discovery"],
  Travel: ["Japan travel / regional food"],
  Study: ["Language learning"],
  Smoothie: ["Food/drink app"],
  Misc: ["Furniture / interior design", "HTML organization tooling", "Appliance comparison", "Needs review"],
};
const SEEDED_FILE_MAP: Record<string, { topic: string; subtopic: string; groupLabel: string; groupKey: string }> = {
  "matcha_catalog.html": { topic: "Matcha", subtopic: "Uji / tea brands", groupLabel: "Matcha catalog", groupKey: "matcha-catalog" },
  "matcha_catalog_android.html": { topic: "Matcha", subtopic: "Uji / tea brands", groupLabel: "Matcha catalog", groupKey: "matcha-catalog" },
  "matcha_catalog(9).html": { topic: "Matcha", subtopic: "Uji / tea brands", groupLabel: "Matcha catalog", groupKey: "matcha-catalog" },
  "matcha_guide_marukyu_tab_prototype.html": { topic: "Matcha", subtopic: "Uji / tea brands", groupLabel: "Marukyu matcha guide", groupKey: "marukyu-matcha-guide" },
  "matcha_guide_marukyu_tab_luxury_v2.html": { topic: "Matcha", subtopic: "Uji / tea brands", groupLabel: "Marukyu matcha guide", groupKey: "marukyu-matcha-guide" },
  "shikoku_food_guide.html": { topic: "Travel", subtopic: "Japan travel / regional food", groupLabel: "Shikoku food guide", groupKey: "shikoku-food-guide" },
  "shikoku_november_mobile_guide.html": { topic: "Travel", subtopic: "Japan travel / regional food", groupLabel: "Shikoku November guide", groupKey: "shikoku-november-guide" },
  "shikoku_november_mobile_guide_v2.html": { topic: "Travel", subtopic: "Japan travel / regional food", groupLabel: "Shikoku November guide", groupKey: "shikoku-november-guide" },
  "coffee_table_comparison.html": { topic: "Misc", subtopic: "Furniture / interior design", groupLabel: "Coffee table comparison", groupKey: "coffee-table-comparison" },
  "android_html_versions_browser.html": { topic: "Misc", subtopic: "HTML organization tooling", groupLabel: "Android HTML versions browser", groupKey: "android-html-versions-browser" },
  "android_html_content_browser.html": { topic: "Misc", subtopic: "HTML organization tooling", groupLabel: "Android HTML content browser", groupKey: "android-html-content-browser" },
  "android_html_content_browser_open_recent.html": { topic: "Misc", subtopic: "HTML organization tooling", groupLabel: "Android HTML content browser", groupKey: "android-html-content-browser" },
  "android_html_content_browser_refresh_recent.html": { topic: "Misc", subtopic: "HTML organization tooling", groupLabel: "Android HTML content browser", groupKey: "android-html-content-browser" },
  "android_html_content_browser_group_android_copies.html": { topic: "Misc", subtopic: "HTML organization tooling", groupLabel: "Android HTML content browser", groupKey: "android-html-content-browser" },
  "android_html_content_browser_dense.html": { topic: "Misc", subtopic: "HTML organization tooling", groupLabel: "Android HTML content browser", groupKey: "android-html-content-browser" },
  "android_html_prefix_grouped_browser.html": { topic: "Misc", subtopic: "HTML organization tooling", groupLabel: "Android HTML prefix grouped browser", groupKey: "android-html-prefix-grouped-browser" },
  "smoothie_builder_interactive.html": { topic: "Smoothie", subtopic: "Food/drink app", groupLabel: "Smoothie builder", groupKey: "smoothie-builder" },
  "index.html": { topic: "Smoothie", subtopic: "Food/drink app", groupLabel: "Smoothie builder", groupKey: "smoothie-builder" },
  "japanese_scenario_cheatsheet.html": { topic: "Study", subtopic: "Language learning", groupLabel: "Japanese scenario cheatsheet", groupKey: "japanese-scenario-cheatsheet" },
  "sf_coffee_matcha_catalog.html": { topic: "Matcha", subtopic: "Local cafe/matcha discovery", groupLabel: "SF coffee matcha catalog", groupKey: "sf-coffee-matcha-catalog" },
  "sf_coffee_matcha_catalog_with_map.html": { topic: "Matcha", subtopic: "Local cafe/matcha discovery", groupLabel: "SF coffee matcha catalog", groupKey: "sf-coffee-matcha-catalog" },
  "sf_coffee_matcha_catalog_tracker_supabase.html": { topic: "Matcha", subtopic: "Local cafe/matcha discovery", groupLabel: "SF coffee matcha catalog", groupKey: "sf-coffee-matcha-catalog" },
  "joyoung_comparison_mobile.html": { topic: "Misc", subtopic: "Appliance comparison", groupLabel: "Joyoung comparison", groupKey: "joyoung-comparison" },
};

const navigatorApp = requiredElement<HTMLElement>("navigatorApp");
const viewerApp = requiredElement<HTMLElement>("viewerApp");
const siteGrid = requiredElement<HTMLElement>("siteGrid");
const htmlUploadTop = requiredElement<HTMLInputElement>("htmlUploadTop");
const htmlUploadSide = requiredElement<HTMLInputElement>("htmlUploadSide");
const siteTitleInput = requiredElement<HTMLInputElement>("siteTitle");
const siteUrlInput = requiredElement<HTMLInputElement>("siteUrl");
const routeSearch = requiredElement<HTMLInputElement>("routeSearch");
const routeCount = requiredElement<HTMLElement>("routeCount");
const storageStatus = requiredElement<HTMLElement>("storageStatus");
const uploadStatus = requiredElement<HTMLElement>("uploadStatus");
const classificationModal = requiredElement<HTMLElement>("classificationModal");
const classificationSummary = requiredElement<HTMLElement>("classificationSummary");
const classificationCount = requiredElement<HTMLElement>("classificationCount");
const classificationList = requiredElement<HTMLElement>("classificationList");
const classificationSkip = requiredElement<HTMLButtonElement>("classificationSkip");
const classificationSaveAll = requiredElement<HTMLButtonElement>("classificationSaveAll");
const classificationAcceptAll = requiredElement<HTMLButtonElement>("classificationAcceptAll");
const renameModal = requiredElement<HTMLElement>("renameModal");
const renameInput = requiredElement<HTMLInputElement>("renameInput");
const renameCancel = requiredElement<HTMLButtonElement>("renameCancel");
const renameSave = requiredElement<HTMLButtonElement>("renameSave");
const viewerTitle = requiredElement<HTMLElement>("viewerTitle");
const viewerAddress = requiredElement<HTMLElement>("viewerAddress");
const viewerFrameWrap = requiredElement<HTMLElement>("viewerFrameWrap");
const openDirectButton = requiredElement<HTMLButtonElement>("openDirect");

let routesState: RouteItem[] = [];
let taxonomyState = cloneDefaultTaxonomy();
let loadError = "";
let pendingReviewQueue: string[] = [];
let activeRenameRouteId: string | null = null;
let dragArtifactId: string | null = null;
const collapsedGroups = new Set(readCollapsedGroups());

function requiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing required element #${id}`);
  return element as T;
}

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function supabaseHeaders(extra: HeadersInit = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

async function restRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const mergedHeaders = supabaseHeaders();
  Object.entries(mergedHeaders).forEach(([key, value]) => headers.set(key, value));
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function storageUpload(path: string, file: File) {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodePath(path)}`, {
    method: "POST",
    headers: supabaseHeaders({
      "content-type": file.type || "text/html",
      "x-upsert": "false",
    }),
    body: file,
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
}

async function storageDelete(path: string) {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodePath(path)}`, {
    method: "DELETE",
    headers: supabaseHeaders(),
  });
  if (!response.ok && response.status !== 404) throw new Error(await readErrorMessage(response));
}

function publicUploadUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodePath(path)}`;
}

function encodePath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function cloneDefaultTaxonomy() {
  return Object.fromEntries(
    Object.entries(DEFAULT_TAXONOMY).map(([topic, subtopics]) => [topic, [...subtopics]]),
  );
}

function readCollapsedGroups() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_COLLAPSE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveCollapsedGroups() {
  localStorage.setItem(LOCAL_COLLAPSE_KEY, JSON.stringify([...collapsedGroups]));
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "group";
}

function makeGroupId(topic: string, subtopic: string, groupKeyOrLabel: string) {
  return [topic, subtopic, groupKeyOrLabel].map(slugify).join("--");
}

function lookupFileKey(value: string) {
  return String(value || "").trim().toLowerCase();
}

function normalizeStemForFamily(fileName: string) {
  let stem = lookupFileKey(fileName).replace(/\.[^.]+$/, "");
  stem = stem.replace(/\(\d+\)$/g, "");
  stem = stem.replace(/(?:_v\d+)+$/g, "");
  let changed = true;
  while (changed) {
    changed = false;
    [
      "_android",
      "_mobile",
      "_prototype",
      "_luxury",
      "_with_map",
      "_tracker_supabase",
      "_refresh_recent",
      "_open_recent",
      "_group_android_copies",
      "_dense",
      "_copies",
    ].forEach((suffix) => {
      if (stem.endsWith(suffix)) {
        stem = stem.slice(0, -suffix.length);
        changed = true;
      }
    });
  }
  return stem;
}

function titleCaseFromStem(stem: string) {
  return stem
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractSourceName(route: Partial<RouteItem>) {
  if (route.sourceName) return route.sourceName;
  const address = String(route.address || "");
  if (address.startsWith("upload://")) return address.replace("upload://", "");
  if (route.mode === "url" && route.url) {
    try {
      return new URL(route.url).pathname.split("/").pop() || route.title || "link";
    } catch {
      return route.title || "link";
    }
  }
  return route.title || "artifact";
}

function normalizeUploadFileName(value: string) {
  return String(value || "").trim().replace(/^upload:\/\//i, "").toLowerCase();
}

function getUploadFileKey(route: Partial<RouteItem>) {
  if (route.mode !== "upload") return "";
  return normalizeUploadFileName(route.sourceName || extractSourceName(route));
}

function formatDate(value: string | null) {
  if (!value) return "Not yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not yet";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function inferPlacement(route: Partial<RouteItem>, sourceText = "") {
  const sourceName = extractSourceName(route);
  const exact = SEEDED_FILE_MAP[lookupFileKey(sourceName)];
  if (exact) {
    return {
      topic: exact.topic,
      subtopic: exact.subtopic,
      groupLabel: exact.groupLabel,
      groupId: makeGroupId(exact.topic, exact.subtopic, exact.groupKey || exact.groupLabel),
      classificationStatus: "mapped",
    };
  }

  const haystack = [sourceName, route.title, route.description, route.address, sourceText]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const stem = normalizeStemForFamily(sourceName);
  const groupLabel = titleCaseFromStem(stem);

  if (/(matcha|marukyu|uji|tea|catalog)/.test(haystack)) {
    const subtopic = /(sf|coffee|cafe|map|tracker)/.test(haystack)
      ? "Local cafe/matcha discovery"
      : "Uji / tea brands";
    return {
      topic: "Matcha",
      subtopic,
      groupLabel,
      groupId: makeGroupId("Matcha", subtopic, stem),
      classificationStatus: "inferred",
    };
  }
  if (/(shikoku|travel|regional|food guide|november)/.test(haystack)) {
    return {
      topic: "Travel",
      subtopic: "Japan travel / regional food",
      groupLabel,
      groupId: makeGroupId("Travel", "Japan travel / regional food", stem),
      classificationStatus: "inferred",
    };
  }
  if (/(japanese|scenario|cheatsheet|language|study)/.test(haystack)) {
    return {
      topic: "Study",
      subtopic: "Language learning",
      groupLabel,
      groupId: makeGroupId("Study", "Language learning", stem),
      classificationStatus: "inferred",
    };
  }
  if (/(smoothie|builder)/.test(haystack) || lookupFileKey(sourceName) === "index.html") {
    return {
      topic: "Smoothie",
      subtopic: "Food/drink app",
      groupLabel: "Smoothie builder",
      groupId: makeGroupId("Smoothie", "Food/drink app", "smoothie-builder"),
      classificationStatus: "inferred",
    };
  }
  if (/(coffee_table|interior|furniture)/.test(haystack)) {
    return {
      topic: "Misc",
      subtopic: "Furniture / interior design",
      groupLabel,
      groupId: makeGroupId("Misc", "Furniture / interior design", stem),
      classificationStatus: "inferred",
    };
  }
  if (/(android_html|browser|prefix_grouped|content_browser|versions_browser)/.test(haystack)) {
    return {
      topic: "Misc",
      subtopic: "HTML organization tooling",
      groupLabel,
      groupId: makeGroupId("Misc", "HTML organization tooling", stem),
      classificationStatus: "inferred",
    };
  }
  if (/(joyoung|comparison|appliance)/.test(haystack)) {
    return {
      topic: "Misc",
      subtopic: "Appliance comparison",
      groupLabel,
      groupId: makeGroupId("Misc", "Appliance comparison", stem),
      classificationStatus: "inferred",
    };
  }
  return {
    topic: "Misc",
    subtopic: "Needs review",
    groupLabel,
    groupId: makeGroupId("Misc", "Needs review", stem),
    classificationStatus: "needs_review",
  };
}

function normalizeRoute(route: Partial<RouteItem>, sourceText = ""): RouteItem {
  const sourceName = extractSourceName(route);
  const uploadedAt = route.uploadedAt || new Date().toISOString();
  const manual = route.manualClassification === true;
  const inferred = manual
    ? {
        topic: route.topic || "Misc",
        subtopic: route.subtopic || "Needs review",
        groupLabel: route.groupLabel || titleCaseFromStem(normalizeStemForFamily(sourceName)),
        groupId: route.groupId || makeGroupId(route.topic || "Misc", route.subtopic || "Needs review", route.groupLabel || normalizeStemForFamily(sourceName)),
        classificationStatus: "manual",
      }
    : inferPlacement({ ...route, sourceName }, sourceText);
  ensureTaxonomyLocally(inferred.topic, inferred.subtopic);
  return {
    id: route.id || uid("route"),
    mode: route.mode || "url",
    type: route.type || (route.mode === "upload" ? "Uploaded HTML" : "Live Site"),
    title: route.title || sourceName.replace(/\.html?$/i, "") || "Untitled",
    description: route.description || "Saved destination.",
    address: route.address || route.url || `upload://${sourceName}`,
    url: route.url ?? null,
    sourceName,
    filePath: route.filePath ?? null,
    topic: inferred.topic,
    subtopic: inferred.subtopic,
    groupLabel: inferred.groupLabel,
    groupId: inferred.groupId,
    classificationStatus: route.classificationStatus === "manual" ? "manual" : inferred.classificationStatus,
    manualClassification: manual,
    uploadedAt,
    lastAccessedAt: route.lastAccessedAt ?? null,
    renamedAt: route.renamedAt ?? null,
    reviewedAt: route.reviewedAt ?? null,
  };
}

function routeMatches(route: RouteItem, query: string) {
  if (!query) return true;
  const haystack = [
    route.title,
    route.topic,
    route.subtopic,
    route.groupLabel,
    route.address,
    route.sourceName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function sortRoutes(routes: RouteItem[]) {
  return [...routes].sort((a, b) =>
    String(a.title || a.sourceName || "").localeCompare(String(b.title || b.sourceName || ""), undefined, { sensitivity: "base" }),
  );
}

function setRoutes(routes: RouteItem[]) {
  routesState = sortRoutes(routes);
}

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createEmptyState(title: string, body: string) {
  const empty = createElement("div", "empty-card");
  empty.append(createElement("h3", "", title), createElement("p", "", body));
  return empty;
}

function buildLibrary(routes: RouteItem[]) {
  const groups = new Map<string, Map<string, Map<string, { groupId: string; groupLabel: string; items: RouteItem[] }>>>();
  routes.forEach((route) => {
    if (!groups.has(route.topic)) groups.set(route.topic, new Map());
    const topicGroups = groups.get(route.topic)!;
    if (!topicGroups.has(route.subtopic)) topicGroups.set(route.subtopic, new Map());
    const subtopicGroups = topicGroups.get(route.subtopic)!;
    if (!subtopicGroups.has(route.groupId)) {
      subtopicGroups.set(route.groupId, { groupId: route.groupId, groupLabel: route.groupLabel, items: [] });
    }
    subtopicGroups.get(route.groupId)!.items.push(route);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => String(a).localeCompare(String(b), undefined, { sensitivity: "base" }))
    .map(([topic, subtopicMap]) => ({
      topic,
      subtopics: [...subtopicMap.entries()]
        .sort(([a], [b]) => String(a).localeCompare(String(b), undefined, { sensitivity: "base" }))
        .map(([subtopic, familyMap]) => ({
          subtopic,
          families: [...familyMap.values()]
            .map((family) => ({ ...family, items: sortRoutes(family.items) }))
            .sort((a, b) => String(a.groupLabel).localeCompare(String(b.groupLabel), undefined, { sensitivity: "base" })),
        })),
    }));
}

function makeCollapseKey(type: string, ...parts: string[]) {
  return [type, ...parts].map((part) => slugify(part)).join("::");
}

function createCollapseToggle(titleElement: HTMLElement, metaElement: HTMLElement, key: string, label: string) {
  const button = createElement("button", "collapse-toggle");
  button.type = "button";
  button.setAttribute("aria-expanded", String(!collapsedGroups.has(key)));
  button.setAttribute("aria-label", label);
  const titleWrap = createElement("span", "toggle-title-wrap");
  titleWrap.append(titleElement, metaElement);
  const icon = createElement("span", "toggle-icon", "⌄");
  icon.setAttribute("aria-hidden", "true");
  button.append(titleWrap, icon);
  button.addEventListener("click", () => {
    if (collapsedGroups.has(key)) collapsedGroups.delete(key);
    else collapsedGroups.add(key);
    saveCollapsedGroups();
    renderRoutes();
  });
  return button;
}

function activateDropTarget(target: HTMLElement) {
  target.classList.add("drop-target-active");
}

function registerDropTarget(element: HTMLElement, onDrop: (routeId: string) => void) {
  element.addEventListener("dragover", (event) => {
    if (!dragArtifactId) return;
    event.preventDefault();
    event.stopPropagation();
    activateDropTarget(element);
  });
  element.addEventListener("dragleave", () => {
    element.classList.remove("drop-target-active");
  });
  element.addEventListener("drop", (event) => {
    if (!dragArtifactId) return;
    event.preventDefault();
    event.stopPropagation();
    element.classList.remove("drop-target-active");
    onDrop(dragArtifactId);
  });
}

function createArtifactRow(route: RouteItem) {
  const row = createElement("div", "artifact-row");
  row.draggable = true;
  row.dataset.routeId = route.id;
  row.addEventListener("dragstart", (event) => {
    dragArtifactId = route.id;
    row.classList.add("dragging");
    event.dataTransfer?.setData("text/plain", route.id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  });
  row.addEventListener("dragend", () => {
    dragArtifactId = null;
    row.classList.remove("dragging");
    document.querySelectorAll(".drop-target-active").forEach((node) => node.classList.remove("drop-target-active"));
  });
  const copy = createElement("div");
  copy.appendChild(createElement("p", "artifact-title", route.title || "Untitled"));
  const meta = createElement("div", "artifact-meta");
  meta.append(
    createElement("span", "", `Uploaded ${formatDate(route.uploadedAt)}`),
    createElement("span", "", `Last opened ${formatDate(route.lastAccessedAt)}`),
    createElement("span", "", route.sourceName),
  );
  copy.appendChild(meta);
  const actions = createElement("div", "artifact-actions");
  const openButton = createElement("button", "card-button primary", "Open Page");
  openButton.type = "button";
  openButton.dataset.open = route.id;
  const renameButton = createElement("button", "card-button", "Rename");
  renameButton.type = "button";
  renameButton.dataset.rename = route.id;
  const removeButton = createElement("button", "card-button delete", "Remove");
  removeButton.type = "button";
  removeButton.dataset.delete = route.id;
  actions.append(openButton, renameButton, removeButton);
  row.append(copy, actions);
  return row;
}

function createFamilyCard(topic: string, subtopic: string, family: { groupId: string; groupLabel: string; items: RouteItem[] }) {
  const card = createElement("article", "family-card");
  const head = createElement("div", "family-head");
  const summary = createElement("div", "family-summary");
  summary.appendChild(createElement("h4", "family-title", family.groupLabel));
  const newest = family.items.reduce((latest, item) => {
    const itemTime = new Date(item.lastAccessedAt || item.uploadedAt || 0).getTime();
    return itemTime > latest ? itemTime : latest;
  }, 0);
  summary.appendChild(createElement("span", "family-stats", `${family.items.length} ${family.items.length === 1 ? "artifact" : "artifacts"} · Updated ${formatDate(newest ? new Date(newest).toISOString() : null)}`));
  head.appendChild(summary);
  const list = createElement("div", "artifact-list");
  family.items.forEach((item) => list.appendChild(createArtifactRow(item)));
  card.append(head, list);
  registerDropTarget(card, (routeId) => {
    void moveRouteToFamily(routeId, topic, subtopic, family.groupId, family.groupLabel);
  });
  return card;
}

function createSubtopicGroup(topic: string, subtopic: string, families: { groupId: string; groupLabel: string; items: RouteItem[] }[]) {
  const key = makeCollapseKey("subtopic", topic, subtopic);
  const section = createElement("section", `subtopic-group${collapsedGroups.has(key) ? " is-collapsed" : ""}`);
  const head = createElement("div", "subtopic-head");
  const itemCount = families.reduce((sum, family) => sum + family.items.length, 0);
  const title = createElement("h4", "subtopic-title", subtopic);
  const meta = createElement("span", "subtopic-meta", `${families.length} ${families.length === 1 ? "family" : "families"} · ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
  head.appendChild(createCollapseToggle(title, meta, key, `Toggle ${subtopic}`));
  const body = createElement("div", "subtopic-body");
  const familyList = createElement("div", "family-list");
  families.forEach((family) => familyList.appendChild(createFamilyCard(topic, subtopic, family)));
  const createFamilyZone = createElement("div", "create-family-zone", "Drop here to create a new family");
  registerDropTarget(createFamilyZone, (routeId) => {
    void moveRouteToNewFamily(routeId, topic, subtopic);
  });
  registerDropTarget(section, (routeId) => {
    void moveRouteToSubtopic(routeId, topic, subtopic);
  });
  body.append(familyList, createFamilyZone);
  section.append(head, body);
  return section;
}

function renderRoutes() {
  const query = routeSearch.value.trim();
  const visibleRoutes = routesState.filter((route) => routeMatches(route, query));
  siteGrid.innerHTML = "";
  routeCount.textContent = `${visibleRoutes.length} ${visibleRoutes.length === 1 ? "item" : "items"}`;
  if (loadError) {
    siteGrid.appendChild(createEmptyState("Unable to load routes", loadError));
    return;
  }
  if (!routesState.length) {
    siteGrid.appendChild(createEmptyState("No pages yet", "Upload one or many HTML files to build your library."));
    return;
  }
  if (!visibleRoutes.length) {
    siteGrid.appendChild(createEmptyState("No matches", "Try another search term."));
    return;
  }
  const library = buildLibrary(visibleRoutes);
  library.forEach((topicGroup) => {
    const key = makeCollapseKey("topic", topicGroup.topic);
    const section = createElement("section", `topic-group${collapsedGroups.has(key) ? " is-collapsed" : ""}`);
    const head = createElement("div", "topic-head");
    const totalItems = topicGroup.subtopics.reduce((sum, subtopic) => sum + subtopic.families.reduce((familySum, family) => familySum + family.items.length, 0), 0);
    const title = createElement("h3", "topic-title", topicGroup.topic);
    const meta = createElement("span", "topic-count", `${topicGroup.subtopics.length} ${topicGroup.subtopics.length === 1 ? "section" : "sections"} · ${totalItems} ${totalItems === 1 ? "item" : "items"}`);
    head.appendChild(createCollapseToggle(title, meta, key, `Toggle ${topicGroup.topic}`));
    const subtopicStack = createElement("div", "subtopic-stack topic-body");
    topicGroup.subtopics.forEach((subtopicGroup) => {
      subtopicStack.appendChild(createSubtopicGroup(topicGroup.topic, subtopicGroup.subtopic, subtopicGroup.families));
    });
    section.append(head, subtopicStack);
    siteGrid.appendChild(section);
  });
}

function setUploadStatus(kind: "success" | "warning" | "error" | "", message: string) {
  uploadStatus.className = "status-banner";
  if (!message) {
    uploadStatus.textContent = "";
    return;
  }
  uploadStatus.textContent = message;
  if (kind) uploadStatus.classList.add(`is-${kind}`);
}

function setStorageStatus(message: string, kind: "success" | "warning" | "error" = "warning") {
  storageStatus.textContent = message;
  storageStatus.style.color = kind === "success" ? "#3e6654" : kind === "error" ? "#8f4d41" : "";
}

async function fetchUploadHtml(path: string) {
  const response = await fetch(publicUploadUrl(path), {
    headers: supabaseHeaders(),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.text();
}

function refreshPendingReviewQueue() {
  pendingReviewQueue = pendingReviewQueue.filter((id) => routesState.some((route) => route.id === id));
}

function getTaxonomyTopics() {
  return [
    ...DEFAULT_TOPIC_ORDER,
    ...Object.keys(taxonomyState)
      .filter((topic) => !DEFAULT_TOPIC_ORDER.includes(topic))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),
  ];
}

function getSubtopicsForTopic(topic: string) {
  const subtopics = taxonomyState[topic] || [];
  return subtopics.length ? subtopics : ["General"];
}

function createTopicSelect(selectedTopic = "") {
  const select = document.createElement("select");
  getTaxonomyTopics().forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    if (topic === selectedTopic) option.selected = true;
    select.appendChild(option);
  });
  if (!select.value && select.options.length) select.value = select.options[0].value;
  return select;
}

function populateSubtopicSelect(select: HTMLSelectElement, topic: string, selectedSubtopic = "") {
  select.innerHTML = "";
  getSubtopicsForTopic(topic).forEach((subtopic) => {
    const option = document.createElement("option");
    option.value = subtopic;
    option.textContent = subtopic;
    if (subtopic === selectedSubtopic) option.selected = true;
    select.appendChild(option);
  });
  if (!select.value && select.options.length) select.value = select.options[0].value;
}

function createReviewField(label: string, control: HTMLElement, sourceText = "") {
  const field = createElement("label", "review-field");
  field.appendChild(createElement("span", "review-label", label));
  field.appendChild(control);
  if (sourceText) field.appendChild(createElement("span", "review-source", sourceText));
  return field;
}

function closeReviewModal() {
  classificationModal.classList.add("hidden");
  classificationList.innerHTML = "";
  pendingReviewQueue = [];
}

function createReviewRow(route: RouteItem) {
  const row = createElement("div", "review-row");
  row.dataset.routeId = route.id;
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = route.title || route.sourceName || "Untitled";
  nameInput.className = "review-name-input";
  const topicSelect = createTopicSelect(route.topic || "Misc");
  topicSelect.className = "review-topic-select";
  const subtopicSelect = document.createElement("select");
  subtopicSelect.className = "review-subtopic-select";
  populateSubtopicSelect(subtopicSelect, topicSelect.value, route.subtopic || "Needs review");
  topicSelect.addEventListener("change", () => populateSubtopicSelect(subtopicSelect, topicSelect.value, ""));
  const familyInput = document.createElement("input");
  familyInput.type = "text";
  familyInput.value = route.groupLabel || titleCaseFromStem(normalizeStemForFamily(route.sourceName || route.title));
  familyInput.className = "review-family-input";
  row.append(
    createReviewField("Display name", nameInput, route.sourceName || extractSourceName(route)),
    createReviewField("Topic", topicSelect),
    createReviewField("Subtopic", subtopicSelect),
    createReviewField("Version family", familyInput),
  );
  return row;
}

function openBatchReviewModal(routeIds: string[]) {
  pendingReviewQueue = routeIds.filter(Boolean);
  const routes = pendingReviewQueue
    .map((id) => routesState.find((route) => route.id === id))
    .filter((route): route is RouteItem => Boolean(route))
    .sort((a, b) => String(a.title || a.sourceName || "").localeCompare(String(b.title || b.sourceName || ""), undefined, { sensitivity: "base" }));
  classificationList.innerHTML = "";
  routes.forEach((route) => classificationList.appendChild(createReviewRow(route)));
  const count = routes.length;
  classificationCount.textContent = `${count} ${count === 1 ? "file" : "files"} ready to place`;
  classificationSummary.textContent = count
    ? "Review the suggested placements below. You can rename each file and adjust the topic, subtopic, or version family before saving."
    : "No new uploads are waiting for review.";
  classificationModal.classList.toggle("hidden", !count);
}

function routePayload(route: RouteItem) {
  return {
    id: route.id,
    mode: route.mode,
    type: route.type,
    title: route.title,
    description: route.description,
    address: route.address,
    url: route.url,
    source_name: route.sourceName,
    file_path: route.filePath,
    topic: route.topic,
    subtopic: route.subtopic,
    group_label: route.groupLabel,
    group_id: route.groupId,
    classification_status: route.classificationStatus,
    manual_classification: route.manualClassification,
    uploaded_at: route.uploadedAt,
    last_accessed_at: route.lastAccessedAt,
    renamed_at: route.renamedAt,
    reviewed_at: route.reviewedAt,
  };
}

function routeFromRecord(record: SupabaseRouteRecord) {
  return normalizeRoute({
    id: record.id,
    mode: record.mode,
    type: record.type || undefined,
    title: record.title || undefined,
    description: record.description || undefined,
    address: record.address || undefined,
    url: record.url,
    sourceName: record.source_name || undefined,
    filePath: record.file_path,
    topic: record.topic || undefined,
    subtopic: record.subtopic || undefined,
    groupLabel: record.group_label || undefined,
    groupId: record.group_id || undefined,
    classificationStatus: record.classification_status || undefined,
    manualClassification: record.manual_classification === true,
    uploadedAt: record.uploaded_at || undefined,
    lastAccessedAt: record.last_accessed_at,
    renamedAt: record.renamed_at,
    reviewedAt: record.reviewed_at,
  });
}

async function ensureTaxonomyRemote(topic: string, subtopic: string) {
  await restRequest<TaxonomyRecord[]>(
    `taxonomy?on_conflict=topic,subtopic`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([{ topic, subtopic }]),
    },
  );
}

function ensureTaxonomyLocally(topic: string, subtopic: string) {
  if (!taxonomyState[topic]) taxonomyState[topic] = [];
  if (subtopic && !taxonomyState[topic].includes(subtopic)) taxonomyState[topic].push(subtopic);
}

async function ensureTaxonomyIncludes(topic: string, subtopic: string) {
  ensureTaxonomyLocally(topic, subtopic);
  await ensureTaxonomyRemote(topic, subtopic);
}

async function updateRouteRecord(route: RouteItem) {
  await restRequest(
    `routes?id=eq.${encodeURIComponent(route.id)}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(routePayload(route)),
    },
  );
}

async function insertRouteRecord(route: RouteItem) {
  await restRequest(
    "routes",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([routePayload(route)]),
    },
  );
}

async function deleteRouteRecord(routeId: string) {
  await restRequest(`routes?id=eq.${encodeURIComponent(routeId)}`, { method: "DELETE" });
}

async function refreshRoutes() {
  if (!hasSupabaseConfig()) {
    loadError = "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.";
    setRoutes([]);
    setStorageStatus("Supabase config missing", "error");
    return;
  }
  try {
    loadError = "";
    setStorageStatus("Loading shared library");
    const [routes, taxonomy] = await Promise.all([
      restRequest<SupabaseRouteRecord[]>("routes?select=*"),
      restRequest<TaxonomyRecord[]>("taxonomy?select=topic,subtopic"),
    ]);
    const nextTaxonomy = cloneDefaultTaxonomy();
    taxonomy.forEach(({ topic, subtopic }) => {
      if (!nextTaxonomy[topic]) nextTaxonomy[topic] = [];
      if (!nextTaxonomy[topic].includes(subtopic)) nextTaxonomy[topic].push(subtopic);
    });
    taxonomyState = nextTaxonomy;
    setRoutes(routes.map(routeFromRecord));
    refreshPendingReviewQueue();
    setStorageStatus("Connected to Supabase", "success");
  } catch (error) {
    setRoutes([]);
    loadError = error instanceof Error ? error.message : "Unable to load saved routes.";
    setStorageStatus("Supabase connection failed", "error");
  }
}

async function addUploadedFiles(fileList: FileList) {
  const files = Array.from(fileList);
  const pendingIds: string[] = [];
  const existingUploadNames = new Set(routesState.map(getUploadFileKey).filter(Boolean));
  const selectedUploadNames = new Set<string>();
  let skippedCount = 0;

  for (const file of files) {
    const fileKey = normalizeUploadFileName(file.name);
    if (!fileKey || existingUploadNames.has(fileKey) || selectedUploadNames.has(fileKey)) {
      skippedCount += 1;
      continue;
    }
    selectedUploadNames.add(fileKey);
    const id = uid("upload");
    const html = await file.text();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const filePath = `${id}/${safeName}`;
    await storageUpload(filePath, file);
    const route = normalizeRoute(
      {
        id,
        mode: "upload",
        type: "Uploaded HTML",
        title: file.name.replace(/\.html?$/i, "") || "Uploaded Page",
        description: "Uploaded page saved to the shared navigator library.",
        address: `upload://${file.name}`,
        url: null,
        sourceName: file.name,
        filePath,
        uploadedAt: new Date().toISOString(),
      },
      html,
    );
    await insertRouteRecord(route);
    routesState.unshift(route);
    pendingIds.push(route.id);
  }

  setRoutes(routesState);
  renderRoutes();
  if (pendingIds.length) {
    openBatchReviewModal(pendingIds);
    setUploadStatus("success", `Added ${pendingIds.length} ${pendingIds.length === 1 ? "file" : "files"} to the shared library.`);
  } else if (skippedCount) {
    setUploadStatus("warning", "No new files were added. Matching file names already exist or were selected more than once.");
  } else {
    setUploadStatus("warning", "No valid HTML files were added.");
  }
}

function normalizeUrl(url: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

async function addLinkRoute() {
  const title = siteTitleInput.value.trim();
  const url = normalizeUrl(siteUrlInput.value.trim());
  if (!url) {
    siteUrlInput.focus();
    return;
  }
  const route = normalizeRoute({
    id: uid("link"),
    mode: "url",
    type: "Live Site",
    title: title || "Linked Site",
    description: "External destination opened in the full-screen viewer.",
    address: url,
    url,
    sourceName: title || url,
    uploadedAt: new Date().toISOString(),
  });
  await insertRouteRecord(route);
  setRoutes([route, ...routesState]);
  renderRoutes();
  siteTitleInput.value = "";
  siteUrlInput.value = "";
  setUploadStatus("success", "Saved link to the shared library.");
}

function openRenameModal(routeId: string) {
  const route = routesState.find((item) => item.id === routeId);
  if (!route) return;
  activeRenameRouteId = routeId;
  renameInput.value = route.title || route.sourceName || "Untitled";
  renameModal.classList.remove("hidden");
  requestAnimationFrame(() => {
    renameInput.focus();
    renameInput.select();
  });
}

function closeRenameModal() {
  activeRenameRouteId = null;
  renameInput.value = "";
  renameModal.classList.add("hidden");
}

async function renameRoute(routeId: string, newTitle: string) {
  const cleanTitle = String(newTitle || "").trim();
  if (!cleanTitle) {
    renameInput.focus();
    return;
  }
  const route = routesState.find((item) => item.id === routeId);
  if (!route) return;
  const nextRoute = { ...route, title: cleanTitle, renamedAt: new Date().toISOString() };
  await updateRouteRecord(nextRoute);
  setRoutes(routesState.map((item) => (item.id === routeId ? nextRoute : item)));
  closeRenameModal();
  renderRoutes();
}

async function deleteRoute(routeId: string) {
  const route = routesState.find((item) => item.id === routeId);
  if (!route) return;
  if (route.mode === "upload" && route.filePath) await storageDelete(route.filePath);
  await deleteRouteRecord(routeId);
  setRoutes(routesState.filter((item) => item.id !== routeId));
  pendingReviewQueue = pendingReviewQueue.filter((id) => id !== routeId);
  renderRoutes();
}

async function markRouteAccessed(routeId: string) {
  const route = routesState.find((item) => item.id === routeId);
  if (!route) return;
  const nextRoute = { ...route, lastAccessedAt: new Date().toISOString() };
  setRoutes(routesState.map((item) => (item.id === routeId ? nextRoute : item)));
  await updateRouteRecord(nextRoute);
}

async function moveRouteToFamily(routeId: string, topic: string, subtopic: string, groupId: string, groupLabel: string) {
  const route = routesState.find((item) => item.id === routeId);
  if (!route) return;
  await ensureTaxonomyIncludes(topic, subtopic);
  const nextRoute = {
    ...route,
    topic,
    subtopic,
    groupId,
    groupLabel,
    classificationStatus: "manual",
    manualClassification: true,
  };
  await updateRouteRecord(nextRoute);
  setRoutes(routesState.map((item) => (item.id === routeId ? nextRoute : item)));
  renderRoutes();
}

async function moveRouteToSubtopic(routeId: string, topic: string, subtopic: string) {
  const route = routesState.find((item) => item.id === routeId);
  if (!route) return;
  await moveRouteToFamily(routeId, topic, subtopic, makeGroupId(topic, subtopic, route.groupLabel), route.groupLabel);
}

async function moveRouteToNewFamily(routeId: string, topic: string, subtopic: string) {
  const route = routesState.find((item) => item.id === routeId);
  if (!route) return;
  const groupLabel = titleCaseFromStem(normalizeStemForFamily(route.sourceName || route.title));
  await moveRouteToFamily(routeId, topic, subtopic, makeGroupId(topic, subtopic, `${groupLabel}-${route.id}`), groupLabel);
}

function openRouteInNewTab(routeId: string) {
  void markRouteAccessed(routeId);
  const targetUrl = new URL(window.location.href);
  targetUrl.search = "";
  targetUrl.hash = "";
  targetUrl.searchParams.set("view", routeId);
  const openedWindow = window.open(targetUrl.toString(), "_blank", "noopener");
  if (!openedWindow) window.location.href = targetUrl.toString();
}

async function renderViewer(routeId: string) {
  const route = routesState.find((item) => item.id === routeId);
  viewerFrameWrap.innerHTML = "";
  if (!route) {
    viewerTitle.textContent = "Not found";
    viewerAddress.textContent = "navigator://missing";
    viewerFrameWrap.appendChild(createEmptyState("Unavailable", "Return to Navigator."));
    openDirectButton.disabled = true;
    return;
  }
  viewerTitle.textContent = route.title || "Destination";
  viewerAddress.textContent = route.address || route.url || "";
  openDirectButton.disabled = route.mode !== "url" || !route.url;
  openDirectButton.onclick = () => {
    if (route.mode === "url" && route.url) {
      void markRouteAccessed(route.id);
      window.open(route.url, "_blank", "noopener");
    }
  };
  const frame = document.createElement("iframe");
  frame.className = "viewer-frame";
  frame.title = route.title || "Destination";
  frame.sandbox = "allow-scripts allow-same-origin allow-forms allow-modals allow-popups";
  if (route.mode === "upload" && route.filePath) {
    void fetchUploadHtml(route.filePath)
      .then((html) => {
        frame.srcdoc = html;
      })
      .catch((error) => {
        viewerFrameWrap.innerHTML = "";
        viewerFrameWrap.appendChild(
          createEmptyState(
            "Unable to render upload",
            error instanceof Error ? error.message : "The uploaded HTML file could not be loaded.",
          ),
        );
      });
  } else {
    frame.src = route.url || "";
  }
  viewerFrameWrap.appendChild(frame);
}

function showViewerMode(routeId: string) {
  void markRouteAccessed(routeId);
  document.body.classList.add("viewer-body");
  navigatorApp.classList.add("hidden");
  viewerApp.classList.remove("hidden");
  void renderViewer(routeId);
}

function showNavigatorMode() {
  document.body.classList.remove("viewer-body");
  navigatorApp.classList.remove("hidden");
  viewerApp.classList.add("hidden");
  renderRoutes();
}

async function saveBatchClassifications(acceptSuggestionsOnly = false) {
  const rows = [...classificationList.querySelectorAll<HTMLElement>(".review-row")];
  if (!rows.length) {
    closeReviewModal();
    return;
  }
  const updates = new Map<string, Pick<RouteItem, "title" | "topic" | "subtopic" | "groupLabel" | "groupId" | "classificationStatus" | "manualClassification" | "reviewedAt">>();
  for (const row of rows) {
    const routeId = row.dataset.routeId;
    const route = routeId ? routesState.find((item) => item.id === routeId) : null;
    if (!route || !routeId) continue;
    const title = acceptSuggestionsOnly
      ? route.title
      : (row.querySelector<HTMLInputElement>(".review-name-input")?.value.trim() || route.title);
    const topic = acceptSuggestionsOnly
      ? route.topic
      : (row.querySelector<HTMLSelectElement>(".review-topic-select")?.value || route.topic);
    const subtopic = acceptSuggestionsOnly
      ? route.subtopic
      : (row.querySelector<HTMLSelectElement>(".review-subtopic-select")?.value || route.subtopic);
    const groupLabel = acceptSuggestionsOnly
      ? route.groupLabel
      : (row.querySelector<HTMLInputElement>(".review-family-input")?.value.trim() || route.groupLabel);
    await ensureTaxonomyIncludes(topic, subtopic);
    updates.set(routeId, {
      title,
      topic,
      subtopic,
      groupLabel,
      groupId: makeGroupId(topic, subtopic, groupLabel),
      classificationStatus: "manual",
      manualClassification: true,
      reviewedAt: new Date().toISOString(),
    });
  }
  const nextRoutes = await Promise.all(routesState.map(async (route) => {
    const update = updates.get(route.id);
    if (!update) return route;
    const nextRoute = { ...route, ...update };
    await updateRouteRecord(nextRoute);
    return nextRoute;
  }));
  setRoutes(nextRoutes);
  closeReviewModal();
  renderRoutes();
}

async function readErrorMessage(response: Response) {
  try {
    const payload = await response.json();
    if (payload?.message) return String(payload.message);
    if (payload?.error_description) return String(payload.error_description);
    if (payload?.error) return typeof payload.error === "string" ? payload.error : JSON.stringify(payload.error);
  } catch {
    return `Request failed with status ${response.status}`;
  }
  return `Request failed with status ${response.status}`;
}

async function initialize() {
  await refreshRoutes();
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view) showViewerMode(view);
  else showNavigatorMode();
}

siteGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const openId = target.getAttribute("data-open");
  const renameId = target.getAttribute("data-rename");
  const deleteId = target.getAttribute("data-delete");
  if (openId) openRouteInNewTab(openId);
  if (renameId) openRenameModal(renameId);
  if (deleteId) void deleteRoute(deleteId);
});

[htmlUploadTop, htmlUploadSide].forEach((input) => {
  input.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.files?.length) return;
    try {
      await addUploadedFiles(target.files);
    } catch (error) {
      setUploadStatus("error", error instanceof Error ? error.message : "Upload failed.");
    } finally {
      target.value = "";
    }
  });
});

renameCancel.addEventListener("click", closeRenameModal);
renameSave.addEventListener("click", () => {
  if (activeRenameRouteId) void renameRoute(activeRenameRouteId, renameInput.value);
});
renameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && activeRenameRouteId) void renameRoute(activeRenameRouteId, renameInput.value);
  if (event.key === "Escape") closeRenameModal();
});
renameModal.addEventListener("click", (event) => {
  if (event.target === renameModal) closeRenameModal();
});

classificationSkip.addEventListener("click", closeReviewModal);
classificationSaveAll.addEventListener("click", () => {
  void saveBatchClassifications(false);
});
classificationAcceptAll.addEventListener("click", () => {
  void saveBatchClassifications(true);
});
classificationModal.addEventListener("click", (event) => {
  if (event.target === classificationModal) closeReviewModal();
});

requiredElement<HTMLButtonElement>("addSiteButton").addEventListener("click", () => {
  void addLinkRoute();
});

siteUrlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") void addLinkRoute();
});
siteTitleInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") siteUrlInput.focus();
});
routeSearch.addEventListener("input", renderRoutes);

requiredElement<HTMLButtonElement>("homeButton").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

requiredElement<HTMLButtonElement>("backToNavigator").addEventListener("click", () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("view");
  window.location.href = url.toString();
});

void initialize();
