(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/hooks/useGeoPosition.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/hooks/useGeoPosition.ts
__turbopack_context__.s({
    "useGeoPosition": (()=>useGeoPosition)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
// Define a custom error class for geolocation errors
class GeolocationServiceError extends Error {
    code;
    constructor(message, code){
        super(message);
        this.name = 'GeolocationServiceError'; // Set a distinct name for the error
        this.code = code;
        // Set the prototype explicitly. This is important for instanceof checks to work correctly in some environments.
        Object.setPrototypeOf(this, GeolocationServiceError.prototype);
    }
}
function useGeoPosition() {
    _s();
    const [coords, setCoords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function request() {
        setError(null); // Clear any previous errors when a new request is made
        setCoords(null); // Clear any previous coordinates as well
        if (!navigator.geolocation) {
            setError('Geolocation not supported by your browser.');
            return; // Exit if geolocation is not supported
        }
        try {
            // Wrap the callback-based getCurrentPosition in a Promise
            const position = await new Promise((resolve, reject)=>{
                navigator.geolocation.getCurrentPosition((pos)=>{
                    resolve(pos); // Resolve the Promise with the GeolocationPosition object
                }, (err)=>{
                    // Reject the Promise with our custom Error instance
                    reject(new GeolocationServiceError(err.message, err.code));
                }, {
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 0
                } // Options for getCurrentPosition
                );
            });
            setCoords(position.coords); // Update state with coordinates from the resolved Promise
        } catch (err) {
            if (err instanceof GeolocationServiceError) {
                let errorMessage = 'Geolocation error: ';
                switch(err.code){
                    case GeolocationPositionError.PERMISSION_DENIED:
                        errorMessage += 'Permission denied to access location.';
                        break;
                    case GeolocationPositionError.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case GeolocationPositionError.TIMEOUT:
                        errorMessage += 'The request to get user location timed out.';
                        break;
                    default:
                        errorMessage += err.message; // Use the message from our custom error
                        break;
                }
                setError(errorMessage);
            } else if (err instanceof Error) {
                // Fallback for other standard Error objects
                setError(`An unexpected error occurred: ${err.message}`);
            } else {
                // Fallback for truly unknown error types
                setError('An unknown geolocation error occurred.');
            }
            console.error("Geolocation request failed:", err);
        }
    }
    return {
        coords,
        error,
        request
    };
}
_s(useGeoPosition, "LTJXrN4yfIBnanXYn1cx6N0jNIo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/SearchBar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/SearchBar.tsx
__turbopack_context__.s({
    "default": (()=>SearchBar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useGeoPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useGeoPosition.ts [app-client] (ecmascript)"); // Assuming this hook exists and is correct
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function SearchBar({ onSearch, onLocate, initialQuery = '', initialLocation = '' }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialQuery);
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLocation);
    const { coords, request } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useGeoPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGeoPosition"])(); // Assuming request is an async function
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col sm:flex-row gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                value: query,
                onChange: (e)=>setQuery(e.target.value),
                placeholder: "What?",
                className: "h-10 flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                value: location,
                onChange: (e)=>setLocation(e.target.value),
                placeholder: "Where?",
                className: "h-10 flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    if (!location.trim()) return;
                    onSearch(query, location);
                },
                className: "h-10 px-4 bg-indigo-600 text-white rounded",
                disabled: !query || !location,
                children: "Search"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                // Refactored lines 48-51:
                onClick: ()=>{
                    // Use `void` to explicitly tell TypeScript/ESLint that the returned Promise
                    // from this async IIFE is intentionally not handled/awaited here.
                    void (async ()=>{
                        if (!coords) {
                            await request(); // request() is presumably async and returns a Promise
                        }
                        // After request() might have updated coords, check again
                        if (coords) {
                            onLocate(coords.latitude, coords.longitude, query);
                        }
                    })(); // Immediately Invoked Async Function Expression
                },
                className: "h-10 px-3 bg-emerald-600 text-white rounded",
                children: "Near me"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SearchBar.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(SearchBar, "DzbIHGrtmxM5o+usOs7j1Xvi7xo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useGeoPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGeoPosition"]
    ];
});
_c = SearchBar;
var _c;
__turbopack_context__.k.register(_c, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/helpers/priceColor.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "priceColor": (()=>priceColor)
});
function priceColor(price) {
    if (!price) return 'text-gray-500';
    // Treat ¥¥ the same way as $$
    const clean = price.replace(/[¥￥€]/g, '$');
    switch(clean){
        case '$':
            return 'text-emerald-600'; // inexpensive
        case '$$':
            return 'text-amber-600'; // moderate
        case '$$$':
            return 'text-rose-600'; // pricey
        default:
            return 'text-gray-500';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/wishlist.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/lib/wishlist.ts
__turbopack_context__.s({
    "addToWishlist": (()=>addToWishlist),
    "removeFromWishlist": (()=>removeFromWishlist)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
;
;
async function addToWishlist(uid, bizId) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'wishlists', uid, 'items', bizId);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(ref, {
        addedAt: Date.now()
    });
}
async function removeFromWishlist(uid, bizId) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'wishlists', uid, 'items', bizId);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])(ref);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/RestaurantCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/RestaurantCard.tsx
__turbopack_context__.s({
    "default": (()=>RestaurantCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>"); // Simplified Star import
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2d$half$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StarHalf$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star-half.js [app-client] (ecmascript) <export default as StarHalf>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$helpers$2f$priceColor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/helpers/priceColor.ts [app-client] (ecmascript)"); // Refactored import path
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/wishlist.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AuthProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Import useState for local loading state
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function SaveButton({ bizId }) {
    _s();
    const { user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (authLoading || !user) {
        return null;
    }
    const handleSave = async ()=>{
        setIsSaving(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToWishlist"])(user.uid, bizId);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Added to wishlist!');
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Could not save, try again.');
            console.error('Error adding to wishlist:', err);
        } finally{
            setIsSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        // Refactored line here:
        onClick: ()=>{
            void handleSave();
        },
        className: "ml-2 text-xs text-indigo-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed",
        disabled: isSaving,
        children: isSaving ? 'Saving...' : 'Save'
    }, void 0, false, {
        fileName: "[project]/src/components/RestaurantCard.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(SaveButton, "MY2a/IQVTvgN2yhwlvOBMiMaNkE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = SaveButton;
function Stars({ rating }) {
    const filled = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - filled - half;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex",
        children: [
            Array.from({
                length: filled
            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                    size: 16
                }, `f${i}`, false, {
                    fileName: "[project]/src/components/RestaurantCard.tsx",
                    lineNumber: 59,
                    columnNumber: 53
                }, this)),
            half === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2d$half$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StarHalf$3e$__["StarHalf"], {
                size: 16
            }, void 0, false, {
                fileName: "[project]/src/components/RestaurantCard.tsx",
                lineNumber: 60,
                columnNumber: 22
            }, this),
            Array.from({
                length: empty
            }).map((_, i)=>// Use Star directly, applying opacity for outlined appearance
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                    size: 16,
                    className: "opacity-40"
                }, `o${i}`, false, {
                    fileName: "[project]/src/components/RestaurantCard.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RestaurantCard.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c1 = Stars;
function RestaurantCard({ id, name, rating, price, category, photoUrl }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "flex flex-col h-full rounded-xl border shadow transition",
        "data-testid": "restaurant-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-32 sm:h-40 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: photoUrl ?? '/placeholder.png',
                    alt: name,
                    fill: true,
                    className: "rounded-t-xl object-cover",
                    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                }, void 0, false, {
                    fileName: "[project]/src/components/RestaurantCard.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/RestaurantCard.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 p-3 flex flex-col justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold flex-1 text-gray-900 dark:text-gray-100",
                                children: name
                            }, void 0, false, {
                                fileName: "[project]/src/components/RestaurantCard.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SaveButton, {
                                bizId: id
                            }, void 0, false, {
                                fileName: "[project]/src/components/RestaurantCard.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RestaurantCard.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 dark:text-gray-300 mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stars, {
                                rating: rating
                            }, void 0, false, {
                                fileName: "[project]/src/components/RestaurantCard.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            " ",
                            rating.toFixed(1),
                            " •",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$helpers$2f$priceColor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["priceColor"])(price) + ' dark:opacity-90',
                                children: price ?? '?'
                            }, void 0, false, {
                                fileName: "[project]/src/components/RestaurantCard.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            " • ",
                            category
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RestaurantCard.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RestaurantCard.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RestaurantCard.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
_c2 = RestaurantCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SaveButton");
__turbopack_context__.k.register(_c1, "Stars");
__turbopack_context__.k.register(_c2, "RestaurantCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/searchClient.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/lib/searchClient.ts
// Make sure your Business interface is accessible, e.g.:
__turbopack_context__.s({
    "searchFoursquare": (()=>searchFoursquare)
});
async function searchFoursquare(params) {
    const url = new URL('/api/search', window.location.origin);
    Object.entries(params).forEach(([k, v])=>{
        if (v !== undefined && v !== '') {
            url.searchParams.set(k, String(v));
        }
    });
    console.log("searchFoursquare: Calling API with URL:", url.toString());
    const res = await fetch(url.toString());
    if (!res.ok) {
        let errorMessage = `API error: ${res.status} ${res.statusText}`;
        try {
            // Explicitly type the error response body
            const errorBody = await res.json();
            // Access properties safely using optional chaining or nullish coalescing
            if (errorBody?.error) {
                errorMessage += ` - Details: ${errorBody.error}`;
            } else if (errorBody?.message) {
                errorMessage += ` - Details: ${errorBody.message}`;
            } else if (Object.keys(errorBody).length > 0) {
                errorMessage += ` - Body: ${JSON.stringify(errorBody)}`;
            }
        } catch (e) {
            console.warn("searchFoursquare: Could not parse error response body as JSON.", e);
            errorMessage += ` - Could not parse error response body. Original error: ${e instanceof Error ? e.message : String(e)}`;
        }
        console.error("searchFoursquare: Fetch failed with error:", errorMessage);
        throw new Error(errorMessage);
    }
    try {
        // Explicitly type the successful data response
        const data = await res.json();
        console.log("searchFoursquare: Received data:", data);
        // Ensure data.businesses exists and is an array before returning
        if (!data.businesses || !Array.isArray(data.businesses)) {
            throw new Error("API response is missing 'businesses' array or it's not an array.");
        }
        return data.businesses;
    } catch (e) {
        console.error("searchFoursquare: Error parsing JSON response:", e);
        // Safely access error message
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error("Invalid JSON response from API. Details: " + errorMessage);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/SearchPageClient.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/SearchPageClient.tsx
__turbopack_context__.s({
    "default": (()=>SearchPageClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SearchBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RestaurantCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RestaurantCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$searchClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/searchClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
/* ------------------------------------------------------------------------------------------ */ /* Debounce Helper Function (as corrected in previous turn, to avoid TypeScript 'any' errors) */ /* ------------------------------------------------------------------------------------------ */ function debounce(func, delay) {
    let timeoutId = null;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            func.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}
function SearchPageClient() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // ---------------- state ----------------
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastQuery, setLastQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('restaurants');
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SearchPageClient.useState": ()=>params.get('term') ?? ''
    }["SearchPageClient.useState"]);
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SearchPageClient.useState": ()=>params.get('location') ?? ''
    }["SearchPageClient.useState"]);
    const [selectedPrices, setSelectedPrices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCats, setSelectedCats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // 'error' state is now used!
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // New state variable
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchPageClient.useEffect": ()=>{
            setMounted(true); // Set to true once the component mounts on the client
        }
    }["SearchPageClient.useEffect"], []);
    // ---------------- effects ----------------
    const fetchResultsCore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SearchPageClient.useCallback[fetchResultsCore]": async (query, opts = {})=>{
            setError(null); // Clear any previous errors at the start of a new search
            setLoading(true);
            try {
                console.log('fetchResultsCore: Preparing to search with query:', query, 'and opts:', opts);
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$searchClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchFoursquare"])({
                    term: query,
                    ...opts,
                    price: selectedPrices.join(',') || undefined,
                    categories: selectedCats.join(',') || undefined
                });
                setResults(data);
                console.log('fetchResultsCore: Received successful data:', data);
            } catch (err) {
                console.error('fetchResultsCore: Error during search operation:', err);
                setResults([]); // Clear results on error
                // --- FIX: Use setError here ---
                setError(`Search failed: ${err instanceof Error ? err.message : String(err)}`);
            } finally{
                setLoading(false); // Always clear loading state
            }
        }
    }["SearchPageClient.useCallback[fetchResultsCore]"], [
        selectedPrices,
        selectedCats
    ]); // Dependencies for useCallback: selectedPrices, selectedCats
    const debouncedFetchResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(debounce({
        "SearchPageClient.useRef": (query, opts)=>{
            // The promise returned by fetchResultsCore is handled internally
            // by its try...catch block, so `void` operator is appropriate here
            // to explicitly indicate we're not awaiting or chaining further.
            void fetchResultsCore(query, opts);
        }
    }["SearchPageClient.useRef"], 500)).current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchPageClient.useEffect": ()=>{
            const currentQuery = params.get('term') ?? '';
            const currentLocation = params.get('location') ?? '';
            const currentPrices = params.getAll('price') || [];
            const currentCategories = params.getAll('categories') || [];
            // Update states from URL params
            setQuery(currentQuery);
            setLocation(currentLocation);
            setSelectedPrices(currentPrices);
            setSelectedCats(currentCategories);
            setLastQuery(currentQuery || 'restaurants');
            console.log("useEffect: currentTerm:", currentQuery, "currentLocation:", currentLocation);
            if (!currentQuery && !currentLocation && !params.get('latitude') && !params.get('longitude')) {
                console.log("useEffect: No search parameters found in URL, not initiating search.");
                setResults([]); // Ensure results are clear if no search parameters
                setError(null); // Ensure no old error is shown
                return;
            }
            const hasLocationData = currentLocation || params.get('latitude') && params.get('longitude');
            if (currentQuery && hasLocationData) {
                console.log("useEffect: Initiating debounced search with term:", currentQuery, "location data present.");
                const opts = {};
                if (currentLocation) opts.location = currentLocation;
                if (params.get('latitude') && params.get('longitude')) {
                    opts.latitude = Number(params.get('latitude'));
                    opts.longitude = Number(params.get('longitude'));
                }
                // Calling the debounced function, which then calls fetchResultsCore
                // The promise handling is inside fetchResultsCore, so `void` is okay here.
                void debouncedFetchResults(currentQuery, opts);
            } else if (currentQuery && !hasLocationData) {
                console.log("useEffect: Term present but no location data. Not initiating full search.");
            // You might want to display a message to the user here, e.g., "Please enter a location."
            // setError('Please provide a location or enable location services to search.');
            }
        }
    }["SearchPageClient.useEffect"], [
        params,
        debouncedFetchResults
    ]); // Dependencies: router is not needed as a dependency here if not directly used to trigger effect
    // ---------------- handlers ----------------
    const togglePrice = (price)=>{
        const newPrices = selectedPrices.includes(price) ? selectedPrices.filter((p)=>p !== price) : [
            ...selectedPrices,
            price
        ];
        setSelectedPrices(newPrices);
        const newParams = new URLSearchParams(params.toString());
        // Clear all existing 'price' params before adding new ones
        params.getAll('price').forEach((p)=>newParams.delete('price', p));
        newPrices.forEach((p)=>newParams.append('price', p));
        // Ensure query and location are preserved if they exist
        if (query) newParams.set('term', query);
        if (location) newParams.set('location', location);
        // Preserve lat/lon if present
        if (params.get('latitude')) newParams.set('latitude', params.get('latitude'));
        if (params.get('longitude')) newParams.set('longitude', params.get('longitude'));
        router.replace(`/?${newParams.toString()}`);
    };
    const toggleCategory = (category)=>{
        const newCats = selectedCats.includes(category) ? selectedCats.filter((c)=>c !== category) : [
            ...selectedCats,
            category
        ];
        setSelectedCats(newCats);
        const newParams = new URLSearchParams(params.toString());
        // Clear all existing 'categories' params before adding new ones
        params.getAll('categories').forEach((c)=>newParams.delete('categories', c));
        newCats.forEach((c)=>newParams.append('categories', c));
        // Ensure query and location are preserved if they exist
        if (query) newParams.set('term', query);
        if (location) newParams.set('location', location);
        // Preserve lat/lon if present
        if (params.get('latitude')) newParams.set('latitude', params.get('latitude'));
        if (params.get('longitude')) newParams.set('longitude', params.get('longitude'));
        router.replace(`/?${newParams.toString()}`);
    };
    const handleSearch = (newQuery, newLocation)=>{
        setQuery(newQuery);
        setLocation(newLocation);
        const newParams = new URLSearchParams();
        if (newQuery) newParams.set('term', newQuery);
        if (newLocation) newParams.set('location', newLocation);
        selectedPrices.forEach((p)=>newParams.append('price', p));
        selectedCats.forEach((c)=>newParams.append('categories', c));
        router.replace(`/?${newParams.toString()}`);
    };
    const handleLocate = (lat, lon, newQuery)=>{
        setQuery(newQuery);
        setLocation(''); // Clear location text if using geo-coordinates
        const newParams = new URLSearchParams();
        if (newQuery) newParams.set('term', newQuery);
        newParams.set('latitude', lat.toString());
        newParams.set('longitude', lon.toString());
        selectedPrices.forEach((p)=>newParams.append('price', p));
        selectedCats.forEach((c)=>newParams.append('categories', c));
        router.replace(`/?${newParams.toString()}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container flex flex-col pt-4 pb-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-3xl font-bold text-center mb-6",
                children: "Find your next favorite spot"
            }, void 0, false, {
                fileName: "[project]/src/app/SearchPageClient.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSearch: handleSearch,
                onLocate: handleLocate,
                initialQuery: query,
                initialLocation: location
            }, void 0, false, {
                fileName: "[project]/src/app/SearchPageClient.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "my-6 flex gap-2 justify-center flex-wrap",
                children: [
                    [
                        '1',
                        '2',
                        '3',
                        '4'
                    ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>togglePrice(p),
                            className: `px-3 py-1 rounded border
                        ${selectedPrices.includes(p) ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-gray-200 dark:bg-gray-700'}`,
                            children: '$'.repeat(Number(p))
                        }, p, false, {
                            fileName: "[project]/src/app/SearchPageClient.tsx",
                            lineNumber: 223,
                            columnNumber: 11
                        }, this)),
                    [
                        {
                            id: '13000',
                            name: 'Pizza'
                        },
                        {
                            id: '13065',
                            name: 'Thai'
                        },
                        {
                            id: '13035',
                            name: 'Coffee Shop'
                        },
                        {
                            id: '13028',
                            name: 'Mexican'
                        },
                        {
                            id: '13064',
                            name: 'Sushi'
                        },
                        {
                            id: '13049',
                            name: 'Burger'
                        }
                    ].map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>toggleCategory(cat.id),
                            className: `px-3 py-1 rounded border capitalize
                        ${selectedCats.includes(cat.id) ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`,
                            children: [
                                cat.name,
                                " "
                            ]
                        }, cat.id, true, {
                            fileName: "[project]/src/app/SearchPageClient.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/SearchPageClient.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center py-10 text-gray-500",
                children: "Loading…"
            }, void 0, false, {
                fileName: "[project]/src/app/SearchPageClient.tsx",
                lineNumber: 254,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center py-10 text-red-500",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/SearchPageClient.tsx",
                lineNumber: 256,
                columnNumber: 17
            }, this),
            mounted && !loading && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: results.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                    children: results.map((biz)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RestaurantCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            id: biz.id,
                            name: biz.name,
                            rating: biz.rating,
                            price: biz.price,
                            category: biz.category ?? 'N/A',
                            photoUrl: biz.photoUrl
                        }, biz.id, false, {
                            fileName: "[project]/src/app/SearchPageClient.tsx",
                            lineNumber: 263,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/SearchPageClient.tsx",
                    lineNumber: 261,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center py-10 text-gray-500",
                    children: [
                        "No results for “",
                        lastQuery,
                        "”."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/SearchPageClient.tsx",
                    lineNumber: 275,
                    columnNumber: 13
                }, this)
            }, void 0, false),
            !mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center py-10 text-gray-500",
                children: "Loading content..."
            }, void 0, false, {
                fileName: "[project]/src/app/SearchPageClient.tsx",
                lineNumber: 282,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/SearchPageClient.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_s(SearchPageClient, "ZjTDfvfV5x0wVa3DIaLkMoJIhD4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SearchPageClient;
var _c;
__turbopack_context__.k.register(_c, "SearchPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_ace31835._.js.map