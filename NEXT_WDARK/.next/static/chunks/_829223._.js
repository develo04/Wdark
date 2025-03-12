(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_829223._.js", {

"[project]/src/app/blog/[slug]/[interna]/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>InternalBlog)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
function InternalBlog() {
    _s();
    const [blogData, setBlogData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Intenta obtener los parámetros tanto de la ruta como de las query params
    const categoriaParam = params?.categoria || searchParams.get('categoria') || '';
    const tituloParam = params?.titulo || searchParams.get('titulo') || '';
    // También intenta obtener un posible nid directo para fallback
    const nidParam = searchParams.get('nid') || '';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InternalBlog.useEffect": ()=>{
            console.log("🔍 Parámetros recibidos:", {
                categoria: categoriaParam,
                titulo: tituloParam,
                nid: nidParam
            });
            const fetchBlogData = {
                "InternalBlog.useEffect.fetchBlogData": async ()=>{
                    try {
                        // Obtener todos los blogs
                        const response = await fetch(`${("TURBOPACK compile-time value", "http://wdark.lndo.site")}/json/nodes`);
                        if (!response.ok) throw new Error(`Error en la respuesta: ${response.status}`);
                        const data = await response.json();
                        console.log("📌 Datos recibidos de la API:", data);
                        // Filtrar blogs que no sean "nid: 1"
                        const filteredData = Array.isArray(data) ? data.filter({
                            "InternalBlog.useEffect.fetchBlogData": (item)=>item.nid !== "1"
                        }["InternalBlog.useEffect.fetchBlogData"]) : [];
                        console.log("📌 Blogs filtrados:", filteredData);
                        if (filteredData.length === 0) throw new Error("No hay blogs disponibles");
                        // Normalizar cadenas para comparación - DEBE COINCIDIR con el proceso en BlogHome
                        const normalizeString = {
                            "InternalBlog.useEffect.fetchBlogData.normalizeString": (str)=>{
                                if (!str) return '';
                                return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
                                .replace(/[^\w\s]/gi, "") // Eliminar caracteres especiales
                                .replace(/\s+/g, " ") // Reemplazar múltiples espacios por uno solo
                                .trim(); // Eliminar espacios al inicio y al final
                            }
                        }["InternalBlog.useEffect.fetchBlogData.normalizeString"];
                        const decodedTitulo = normalizeString(decodeURIComponent(tituloParam));
                        const decodedCategoria = normalizeString(decodeURIComponent(categoriaParam));
                        console.log("📌 Valores normalizados para búsqueda:");
                        console.log("Categoría normalizada:", decodedCategoria);
                        console.log("Título normalizado:", decodedTitulo);
                        let currentBlog = null;
                        // Primero intentamos buscar por nid si está disponible
                        if (nidParam) {
                            currentBlog = filteredData.find({
                                "InternalBlog.useEffect.fetchBlogData": (blog)=>blog.nid === nidParam
                            }["InternalBlog.useEffect.fetchBlogData"]);
                            if (currentBlog) {
                                console.log("✅ Blog encontrado por nid:", currentBlog);
                            }
                        }
                        // Si no tenemos blog por nid y tenemos categoría y título, buscamos por ellos
                        if (!currentBlog && decodedCategoria && decodedTitulo) {
                            // Debemos recorrer cada blog y normalizar sus datos para comparar
                            currentBlog = filteredData.find({
                                "InternalBlog.useEffect.fetchBlogData": (blog)=>{
                                    const blogCategory = normalizeString(blog?.fields?.field_categories?.[0]?.label || "");
                                    const blogTitle = normalizeString(blog.title || "");
                                    console.log(`Comparando blog ${blog.nid}:`);
                                    console.log(`Categoría: '${blogCategory}' vs '${decodedCategoria}'`);
                                    console.log(`Título: '${blogTitle}' vs '${decodedTitulo}'`);
                                    // Verificar si la categoría está contenida en la ruta y el título coincide
                                    const categoryMatch = decodedCategoria === blogCategory || decodedCategoria.includes(blogCategory) || blogCategory.includes(decodedCategoria);
                                    const titleMatch = decodedTitulo === blogTitle || decodedTitulo.includes(blogTitle) || blogTitle.includes(decodedTitulo);
                                    // Para depuración
                                    if (categoryMatch && titleMatch) {
                                        console.log(`✅ Coincidencia encontrada para blog ${blog.nid}`);
                                    }
                                    return categoryMatch && titleMatch;
                                }
                            }["InternalBlog.useEffect.fetchBlogData"]);
                        }
                        // Si aún no encontramos el blog y tenemos solo título, intentamos solo con eso
                        if (!currentBlog && decodedTitulo) {
                            currentBlog = filteredData.find({
                                "InternalBlog.useEffect.fetchBlogData": (blog)=>{
                                    const blogTitle = normalizeString(blog.title || "");
                                    return blogTitle.includes(decodedTitulo) || decodedTitulo.includes(blogTitle);
                                }
                            }["InternalBlog.useEffect.fetchBlogData"]);
                            if (currentBlog) {
                                console.log("✅ Blog encontrado solo por título:", currentBlog);
                            }
                        }
                        // Si todo falla, solo cargamos el primer blog de la lista (para desarrollo)
                        if (!currentBlog && ("TURBOPACK compile-time value", "development") === 'development') {
                            currentBlog = filteredData[0];
                            console.log("⚠️ No se encontró el blog específico. Cargando el primer blog disponible para desarrollo:", currentBlog);
                        }
                        if (!currentBlog) {
                            console.error("⚠️ No se encontró el blog con los valores dados.");
                            console.log("🔍 Búsqueda fallida para: ", {
                                decodedCategoria,
                                decodedTitulo
                            });
                            console.log("🔍 ¿Quizás hay un error en la API o los nombres no coinciden exactamente?");
                            throw new Error("No se encontró el blog específico");
                        }
                        console.log("✅ Blog seleccionado finalmente:", currentBlog);
                        // Hacer la petición específica al blog encontrado
                        const blogResponse = await fetch(`${("TURBOPACK compile-time value", "http://wdark.lndo.site")}/json/node/${currentBlog.nid}`);
                        console.log("Obteniendo detalles para nid:", currentBlog.nid);
                        if (!blogResponse.ok) throw new Error(`Error al obtener el blog: ${blogResponse.status}`);
                        const blogDetails = await blogResponse.json();
                        console.log("📌 Detalles del blog:", blogDetails);
                        setBlogData(blogDetails);
                        // Actualizar la URL para reflejar correctamente el blog que estamos viendo
                        if (("TURBOPACK compile-time value", "development") === 'development' && (!categoriaParam || !tituloParam)) {
                            const categorySlug = encodeURIComponent(blogDetails.fields?.field_categories?.[0]?.label || '');
                            const titleSlug = encodeURIComponent(blogDetails.title || '');
                            // Actualiza URL sin refrescar la página
                            window.history.replaceState({}, '', `/blog/${categorySlug}/${titleSlug}`);
                        }
                    } catch (err) {
                        console.error("⚠️ Error:", err.message);
                        setError(err.message);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["InternalBlog.useEffect.fetchBlogData"];
            fetchBlogData();
        }
    }["InternalBlog.useEffect"], [
        categoriaParam,
        tituloParam,
        nidParam
    ]);
    const handleCategoryClick = (category)=>{
        router.push(`/blog?category=${encodeURIComponent(category)}`);
    };
    const handleTagClick = (tag)=>{
        router.push(`/blog?tag=${encodeURIComponent(tag)}`);
    };
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        children: "Cargando contenido del blog..."
    }, void 0, false, {
        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
        lineNumber: 172,
        columnNumber: 25
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        style: {
            color: "red"
        },
        children: [
            "Error al cargar el contenido del blog: ",
            error
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
        lineNumber: 173,
        columnNumber: 21
    }, this);
    if (!blogData) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        children: "No se encontró el contenido del blog."
    }, void 0, false, {
        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
        lineNumber: 174,
        columnNumber: 25
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "internal-blog",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "internal-blog-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "internal-blog-header-items",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "internal-blog-header-title",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "internal-blog-title",
                                    children: blogData.title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "internal-blog-subtitle",
                                    children: blogData.fields?.field_subtitle
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "internal-blog-label-general",
                                    children: blogData.fields?.field_categories?.[0]?.label
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "internal-blog-breadcrumb",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    children: "Inicio"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this),
                                " / ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/blog",
                                    children: "Blog"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 186,
                                    columnNumber: 44
                                }, this),
                                " /",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/blog?category=${encodeURIComponent(blogData.fields?.field_categories?.[0]?.label || '')}`,
                                    children: blogData.fields?.field_categories?.[0]?.label || ''
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                " / ",
                                blogData.title
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "internal-blog-labels-and-article",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "internal-blog-labels",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "internal-blog-labels-categories",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "internal-blog-labels-categories-title",
                                        children: "Categorias"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "internal-blog-labels-categories-items",
                                        children: [
                                            blogData.fields?.field_categories?.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "internal-blog-label-categories-item",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        className: "internal-blog-label-categories-link",
                                                        onClick: ()=>handleCategoryClick(category.label),
                                                        children: category.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                        lineNumber: 200,
                                                        columnNumber: 19
                                                    }, this)
                                                }, index, false, {
                                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                    lineNumber: 199,
                                                    columnNumber: 17
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "internal-blog-label-categories-item-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    className: "internal-blog-label-categories-link",
                                                    onClick: ()=>router.push('/blog'),
                                                    children: "Todas las categorías"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                    lineNumber: 206,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                lineNumber: 205,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "internal-blog-labels-tag",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "internal-blog-labels-tag-title",
                                        children: "Etiquetas"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "internal-blog-labels-tag-items",
                                        children: blogData.fields?.field_labels?.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "internal-blog-label-tag-item",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    className: "internal-blog-label-tag-link",
                                                    onClick: ()=>handleTagClick(tag.label),
                                                    children: tag.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                    lineNumber: 215,
                                                    columnNumber: 19
                                                }, this)
                                            }, index, false, {
                                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "internal-blog-article",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "internal-blog-article-principal-description",
                                dangerouslySetInnerHTML: {
                                    __html: blogData.fields?.field_full_html_text?.split('</p>')[0] + '</p>'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "internal-blog-article-image",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: blogData.fields?.field_principal_image_blog?.[0]?.src,
                                    alt: blogData.title,
                                    width: 800,
                                    height: 450
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "internal-blog-article-description",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    dangerouslySetInnerHTML: {
                                        __html: blogData.fields?.field_full_html_text?.split('</p>').slice(1).join('</p>') || ''
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "internal-blog-article-logo-wdark",
                                children: [
                                    blogData.fields?.field_logo_wdark && blogData.fields.field_logo_wdark[0] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: `${("TURBOPACK compile-time value", "http://wdark.lndo.site")}${blogData.fields.field_logo_wdark[0].src}`,
                                        alt: blogData.fields.field_logo_wdark[0].label || "Logo",
                                        width: 150,
                                        height: 50,
                                        style: {
                                            width: 'auto',
                                            height: 'auto'
                                        },
                                        priority: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                        lineNumber: 238,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "internal-blog-article-auth-name-and-position",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "auth-name",
                                                children: blogData.fields?.field_auth_name || ""
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                lineNumber: 249,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "auth-position",
                                                children: blogData.fields?.field_auth_position || ""
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                                lineNumber: 250,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
                lineNumber: 193,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/blog/[slug]/[interna]/page.jsx",
        lineNumber: 177,
        columnNumber: 5
    }, this);
}
_s(InternalBlog, "gDzO3MI/y82Wc2K+FGPRG7vBS8k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = InternalBlog;
var _c;
__turbopack_refresh__.register(_c, "InternalBlog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/blog/[slug]/[interna]/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
module.exports = __turbopack_require__("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_829223._.js.map