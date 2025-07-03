const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Home-7xmnZpOI.js","assets/supabase-BZoxqOT3.js","assets/vendor-seEwQDT5.js","assets/router-BnLuTL28.js","assets/ui-zOJd_8GS.js","assets/products-BfWltiH_.js","assets/About-BR8TppPn.js","assets/Catalog-D8UyBjM-.js","assets/Contact-DqzpzVBN.js","assets/ProductDetail-B1RRmvxi.js","assets/CheckoutForm-zOURXmAS.js","assets/stripe-rSCYVjF0.js","assets/LazyImage-BPD0pW09.js","assets/Cart-DIFNS8BL.js","assets/Checkout-sDR-M_RK.js","assets/Orders-D6mjRww2.js","assets/OrderDetail-Dg7XuOJc.js","assets/Login-D9sJzP_7.js","assets/Profile-DhNuBIOJ.js","assets/AdminLogin-CvAIdL18.js","assets/AdminSetup-BPyPIkUa.js","assets/AdminDashboard-BJ-j1GL0.js","assets/PrivacyPolicy-DyMSi1rw.js","assets/TermsAndConditions-CFTU98qe.js"])))=>i.map(i=>d[i]);
import{r as d,d as ye,a as y}from"./vendor-seEwQDT5.js";import{c as be,_ as b}from"./supabase-BZoxqOT3.js";import{u as se,L as h,N as ae,B as je,R as Y,a as g}from"./router-BnLuTL28.js";import{P as oe,S as J,a as Z,b as Q,C as G,L as K,U as ee,X as ve,M as _e,F as we,I as Ne,c as Ee,d as Ce,e as Ae,f as Oe,g as ke}from"./ui-zOJd_8GS.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function a(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=a(o);fetch(o.href,s)}})();var ie={exports:{}},V={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ie=d,Pe=Symbol.for("react.element"),ze=Symbol.for("react.fragment"),De=Object.prototype.hasOwnProperty,$e=Ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Le={key:!0,ref:!0,__self:!0,__source:!0};function ne(t,r,a){var i,o={},s=null,n=null;a!==void 0&&(s=""+a),r.key!==void 0&&(s=""+r.key),r.ref!==void 0&&(n=r.ref);for(i in r)De.call(r,i)&&!Le.hasOwnProperty(i)&&(o[i]=r[i]);if(t&&t.defaultProps)for(i in r=t.defaultProps,r)o[i]===void 0&&(o[i]=r[i]);return{$$typeof:Pe,type:t,key:s,ref:n,props:o,_owner:$e.current}}V.Fragment=ze;V.jsx=ne;V.jsxs=ne;ie.exports=V;var e=ie.exports,le,te=ye;le=te.createRoot,te.hydrateRoot;const Se="https://ddmkhgobkzpwlmzgxuzc.supabase.co",Re="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbWtoZ29ia3pwd2xtemd4dXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjczMzAsImV4cCI6MjA2NTQwMzMzMH0.DE0OQ4G93ognZuCH2z2rl-IdCy7ua1w_9bCYJuGJAwA",O=be(Se,Re),ce=d.createContext(void 0),F=()=>{const t=d.useContext(ce);if(t===void 0)throw new Error("useAuth must be used within an AuthProvider");return t},Te=({children:t})=>{const[r,a]=d.useState(null),[i,o]=d.useState(null),[s,n]=d.useState(!1),[l,c]=d.useState(!0),m=async()=>{if(!r)return!1;try{const{data:f,error:v}=await O.from("admin_users").select("id, is_active").eq("user_id",r.id).eq("is_active",!0).maybeSingle(),u=!v&&f;return n(!!u),!!u}catch(f){return console.error("Error checking admin status:",f),n(!1),!1}},p=async(f,v)=>{try{const{data:u,error:w}=await O.auth.signInWithPassword({email:f,password:v});return w?{error:w}:(u.user&&await O.rpc("update_admin_last_login",{admin_user_id:u.user.id}),{error:null})}catch(u){return{error:u}}},x=async()=>{try{await O.auth.signOut()}catch{console.log("Session already invalid, clearing local state")}finally{n(!1),a(null),o(null)}};d.useEffect(()=>{O.auth.getSession().then(({data:{session:v}})=>{o(v),a((v==null?void 0:v.user)??null),c(!1)});const{data:{subscription:f}}=O.auth.onAuthStateChange(async(v,u)=>{o(u),a((u==null?void 0:u.user)??null),c(!1),u!=null&&u.user?await m():n(!1)});return()=>f.unsubscribe()},[]),d.useEffect(()=>{r&&m()},[r]);const j={user:r,session:i,isAdmin:s,loading:l,signIn:p,signOut:x,checkAdminStatus:m,supabase:O};return e.jsx(ce.Provider,{value:j,children:t})},de=d.createContext(void 0),Me=()=>{const t=d.useContext(de);if(t===void 0)throw new Error("useCart must be used within a CartProvider");return t},Ve=({children:t})=>{const[r,a]=d.useState([]),[i,o]=d.useState(!1),{user:s,supabase:n}=F(),l=async()=>{if(!s){a([]);return}try{o(!0);const{data:u,error:w}=await n.from("cart_items").select("*").order("created_at",{ascending:!1});if(w)throw w;a(u||[])}catch(u){console.error("Error loading cart:",u)}finally{o(!1)}},c=async(u,w,H,P=1,L,he,fe,ge)=>{if(!s)throw new Error("User must be logged in to add items to cart");try{o(!0);const{data:U,error:X}=await n.rpc("add_to_cart",{p_product_id:u,p_product_name:w,p_unit_price:H,p_quantity:P,p_selected_color:L,p_selected_size:he,p_size_dimensions:fe,p_customer_note:ge});if(X)throw X;await l()}catch(U){throw console.error("Error adding to cart:",U),U}finally{o(!1)}},m=async(u,w,H)=>{try{o(!0);const{data:P,error:L}=await n.rpc("update_cart_item_quantity",{p_cart_item_id:u,p_quantity:w,p_customer_note:H});if(L)throw L;await l()}catch(P){throw console.error("Error updating cart item:",P),P}finally{o(!1)}},p=async u=>{await m(u,0)},x=async()=>{try{o(!0);const{error:u}=await n.rpc("clear_user_cart");if(u)throw u;a([])}catch(u){throw console.error("Error clearing cart:",u),u}finally{o(!1)}};d.useEffect(()=>{l()},[s]);const j=r.reduce((u,w)=>u+w.quantity,0),f=r.reduce((u,w)=>u+w.unit_price*w.quantity,0),v={items:r,loading:i,totalItems:j,totalAmount:f,addToCart:c,updateQuantity:m,removeItem:p,clearCart:x,refreshCart:l};return e.jsx(de.Provider,{value:v,children:t})},Fe=()=>{var p;const[t,r]=d.useState(!1),a=se(),{user:i,signOut:o,isAdmin:s}=F(),{totalItems:n}=Me(),l=[{name:"Home",href:"/"},{name:"Catalogo",href:"/catalogo"},{name:"Servizi su Misura",href:"/contatti"},{name:"Informazioni",href:"/chi-siamo"}],c=x=>!!(x==="/"&&a.pathname==="/"||x!=="/"&&a.pathname.startsWith(x)),m=async()=>{await o(),r(!1)};return e.jsxs("header",{className:"bg-white shadow-sm sticky top-0 z-50",children:[e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex justify-between items-center h-16",children:[e.jsxs(h,{to:"/",className:"flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors",children:[e.jsx(oe,{className:"h-8 w-8"}),e.jsx("span",{children:"3D su Misura"})]}),e.jsxs("nav",{className:"hidden md:flex items-center space-x-8",children:[l.map(x=>e.jsx(h,{to:x.href,className:`px-3 py-2 text-sm font-medium transition-colors rounded-md ${c(x.href)?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,children:x.name},x.name)),i?e.jsxs("div",{className:"flex items-center space-x-4",children:[s&&e.jsxs(h,{to:"/admin/dashboard",className:`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/admin/dashboard"?"text-purple-600 bg-purple-50":"text-purple-600 hover:text-purple-700 hover:bg-purple-50"}`,children:[e.jsx(J,{className:"h-4 w-4"}),e.jsx("span",{children:"Admin"})]}),e.jsxs(h,{to:"/carrello",className:`relative px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/carrello"?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,children:[e.jsx(Z,{className:"h-4 w-4"}),e.jsx("span",{children:"Carrello"}),n>0&&e.jsx("span",{className:"absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center",children:n})]}),e.jsxs(h,{to:"/ordini",className:`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname.startsWith("/ordini")?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,children:[e.jsx(Q,{className:"h-4 w-4"}),e.jsx("span",{children:"Ordini"})]}),e.jsxs(h,{to:"/profilo",className:`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/profilo"?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,children:[e.jsx(G,{className:"h-4 w-4"}),e.jsx("span",{children:"Profilo"})]}),e.jsxs("button",{onClick:m,className:"flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors",children:[e.jsx(K,{className:"h-4 w-4"}),e.jsx("span",{children:"Esci"})]})]}):e.jsxs(h,{to:"/login",className:`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/login"?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,children:[e.jsx(ee,{className:"h-4 w-4"}),e.jsx("span",{children:"Accedi"})]})]}),e.jsx("button",{className:"md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors",onClick:()=>r(!t),children:t?e.jsx(ve,{className:"h-6 w-6"}):e.jsx(_e,{className:"h-6 w-6"})})]})}),t&&e.jsx("div",{className:"md:hidden bg-white border-t border-gray-200",children:e.jsxs("div",{className:"px-2 pt-2 pb-3 space-y-1",children:[l.map(x=>e.jsx(h,{to:x.href,className:`block px-3 py-2 text-base font-medium transition-colors rounded-md ${c(x.href)?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,onClick:()=>r(!1),children:x.name},x.name)),i?e.jsxs("div",{className:"border-t border-gray-200 pt-3 mt-3 space-y-1",children:[s&&e.jsxs(h,{to:"/admin/dashboard",className:`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/admin/dashboard"?"text-purple-600 bg-purple-50":"text-purple-600 hover:text-purple-700 hover:bg-purple-50"}`,onClick:()=>r(!1),children:[e.jsx(J,{className:"h-4 w-4"}),e.jsx("span",{children:"Admin Dashboard"})]}),e.jsxs(h,{to:"/carrello",className:`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/carrello"?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,onClick:()=>r(!1),children:[e.jsx(Z,{className:"h-4 w-4"}),e.jsx("span",{children:"Carrello"}),n>0&&e.jsx("span",{className:"bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto",children:n})]}),e.jsxs(h,{to:"/ordini",className:`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname.startsWith("/ordini")?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,onClick:()=>r(!1),children:[e.jsx(Q,{className:"h-4 w-4"}),e.jsx("span",{children:"Ordini"})]}),e.jsxs(h,{to:"/profilo",className:`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/profilo"?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,onClick:()=>r(!1),children:[e.jsx(G,{className:"h-4 w-4"}),e.jsx("span",{children:"Profilo"})]}),e.jsxs("div",{className:"px-3 py-2 text-sm text-gray-600",children:["Ciao, ",((p=i.user_metadata)==null?void 0:p.full_name)||i.email,s&&e.jsx("span",{className:"block text-xs text-purple-600 font-medium",children:"Amministratore"})]}),e.jsxs("button",{onClick:m,className:"block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-1",children:[e.jsx(K,{className:"h-4 w-4"}),e.jsx("span",{children:"Esci"})]})]}):e.jsx("div",{className:"border-t border-gray-200 pt-3 mt-3",children:e.jsxs(h,{to:"/login",className:`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${a.pathname==="/login"?"text-blue-600 bg-blue-50":"text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`,onClick:()=>r(!1),children:[e.jsx(ee,{className:"h-4 w-4"}),e.jsx("span",{children:"Accedi"})]})})]})})]})},qe=()=>e.jsx("footer",{className:"bg-gray-900 text-white",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-8",children:[e.jsxs("div",{className:"col-span-1 md:col-span-2",children:[e.jsxs(h,{to:"/",className:"flex items-center space-x-2 text-2xl font-bold mb-4",children:[e.jsx(oe,{className:"h-8 w-8 text-blue-400"}),e.jsx("span",{children:"3D su Misura"})]}),e.jsx("p",{className:"text-gray-300 mb-6 max-w-md",children:"Specializziamo nella stampa 3D professionale di alta qualità. Dalla prototipazione rapida agli oggetti personalizzati, trasformiamo le tue idee in realtà."}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsx("a",{href:"#",className:"text-gray-400 hover:text-blue-400 transition-colors",children:e.jsx(we,{className:"h-6 w-6"})}),e.jsx("a",{href:"#",className:"text-gray-400 hover:text-blue-400 transition-colors",children:e.jsx(Ne,{className:"h-6 w-6"})}),e.jsx("a",{href:"#",className:"text-gray-400 hover:text-blue-400 transition-colors",children:e.jsx(Ee,{className:"h-6 w-6"})})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Link Rapidi"}),e.jsxs("ul",{className:"space-y-2",children:[e.jsx("li",{children:e.jsx(h,{to:"/",className:"text-gray-300 hover:text-white transition-colors",children:"Home"})}),e.jsx("li",{children:e.jsx(h,{to:"/catalogo",className:"text-gray-300 hover:text-white transition-colors",children:"Catalogo"})}),e.jsx("li",{children:e.jsx(h,{to:"/chi-siamo",className:"text-gray-300 hover:text-white transition-colors",children:"Chi Siamo"})}),e.jsx("li",{children:e.jsx(h,{to:"/contatti",className:"text-gray-300 hover:text-white transition-colors",children:"Contatti"})}),e.jsx("li",{children:e.jsx(h,{to:"/privacy-policy",className:"text-gray-300 hover:text-white transition-colors",children:"Privacy Policy"})}),e.jsx("li",{children:e.jsx(h,{to:"/terms-and-conditions",className:"text-gray-300 hover:text-white transition-colors",children:"Termini e Condizioni"})})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Contatti"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(Ce,{className:"h-5 w-5 text-blue-400"}),e.jsx("span",{className:"text-gray-300",children:"info@3dsumisura.it"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(Ae,{className:"h-5 w-5 text-blue-400"}),e.jsx("span",{className:"text-gray-300",children:"+39 123 456 7890"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(Oe,{className:"h-5 w-5 text-blue-400"}),e.jsx("span",{className:"text-gray-300",children:"Via Roma 123, Milano"})]})]})]})]}),e.jsx("div",{className:"border-t border-gray-800 mt-8 pt-8 text-center text-gray-400",children:e.jsxs("p",{children:["© ",new Date().getFullYear()," 3D su Misura. Tutti i diritti riservati. |",e.jsx(h,{to:"/privacy-policy",className:"ml-2 hover:text-white transition-colors",children:"Privacy Policy"})," |",e.jsx(h,{to:"/terms-and-conditions",className:"ml-2 hover:text-white transition-colors",children:"Termini e Condizioni"})]})})]})}),He=({children:t})=>{const{user:r,isAdmin:a,loading:i}=F();return i?e.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Verifica autorizzazioni..."})]})}):r?a?e.jsx(e.Fragment,{children:t}):e.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx(J,{className:"h-16 w-16 text-red-500 mx-auto mb-4"}),e.jsx("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Accesso Negato"}),e.jsx("p",{className:"text-gray-600 mb-4",children:"Non hai i permessi per accedere a questa area"}),e.jsx("button",{onClick:()=>window.location.href="/",className:"bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium",children:"Torna alla Home"})]})}):e.jsx(ae,{to:"/admin/login",replace:!0})},z=({children:t})=>{const{user:r,loading:a}=F(),i=se();return a?e.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Caricamento..."})]})}):r?e.jsx(e.Fragment,{children:t}):e.jsx(ae,{to:"/login",state:{from:i},replace:!0})},S=()=>e.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx(ke,{className:"h-12 w-12 animate-spin text-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600 text-lg",children:"Caricamento..."})]})});let Ue={data:""},Je=t=>typeof window=="object"?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||Ue,Be=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,We=/\/\*[^]*?\*\/|  +/g,re=/\n+/g,C=(t,r)=>{let a="",i="",o="";for(let s in t){let n=t[s];s[0]=="@"?s[1]=="i"?a=s+" "+n+";":i+=s[1]=="f"?C(n,s):s+"{"+C(n,s[1]=="k"?"":r)+"}":typeof n=="object"?i+=C(n,r?r.replace(/([^,])+/g,l=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,c=>/&/.test(c)?c.replace(/&/g,l):l?l+" "+c:c)):s):n!=null&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=C.p?C.p(s,n):s+":"+n+";")}return a+(r&&o?r+"{"+o+"}":o)+i},N={},me=t=>{if(typeof t=="object"){let r="";for(let a in t)r+=a+me(t[a]);return r}return t},Xe=(t,r,a,i,o)=>{let s=me(t),n=N[s]||(N[s]=(c=>{let m=0,p=11;for(;m<c.length;)p=101*p+c.charCodeAt(m++)>>>0;return"go"+p})(s));if(!N[n]){let c=s!==t?t:(m=>{let p,x,j=[{}];for(;p=Be.exec(m.replace(We,""));)p[4]?j.shift():p[3]?(x=p[3].replace(re," ").trim(),j.unshift(j[0][x]=j[0][x]||{})):j[0][p[1]]=p[2].replace(re," ").trim();return j[0]})(t);N[n]=C(o?{["@keyframes "+n]:c}:c,a?"":"."+n)}let l=a&&N.g?N.g:null;return a&&(N.g=N[n]),((c,m,p,x)=>{x?m.data=m.data.replace(x,c):m.data.indexOf(c)===-1&&(m.data=p?c+m.data:m.data+c)})(N[n],r,i,l),n},Ye=(t,r,a)=>t.reduce((i,o,s)=>{let n=r[s];if(n&&n.call){let l=n(a),c=l&&l.props&&l.props.className||/^go/.test(l)&&l;n=c?"."+c:l&&typeof l=="object"?l.props?"":C(l,""):l===!1?"":l}return i+o+(n??"")},"");function q(t){let r=this||{},a=t.call?t(r.p):t;return Xe(a.unshift?a.raw?Ye(a,[].slice.call(arguments,1),r.p):a.reduce((i,o)=>Object.assign(i,o&&o.call?o(r.p):o),{}):a,Je(r.target),r.g,r.o,r.k)}let ue,B,W;q.bind({g:1});let E=q.bind({k:1});function Ze(t,r,a,i){C.p=r,ue=t,B=a,W=i}function A(t,r){let a=this||{};return function(){let i=arguments;function o(s,n){let l=Object.assign({},s),c=l.className||o.className;a.p=Object.assign({theme:B&&B()},l),a.o=/ *go\d+/.test(c),l.className=q.apply(a,i)+(c?" "+c:"");let m=t;return t[0]&&(m=l.as||t,delete l.as),W&&m[0]&&W(l),ue(m,l)}return o}}var Qe=t=>typeof t=="function",M=(t,r)=>Qe(t)?t(r):t,Ge=(()=>{let t=0;return()=>(++t).toString()})(),xe=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let r=matchMedia("(prefers-reduced-motion: reduce)");t=!r||r.matches}return t}})(),Ke=20,pe=(t,r)=>{switch(r.type){case 0:return{...t,toasts:[r.toast,...t.toasts].slice(0,Ke)};case 1:return{...t,toasts:t.toasts.map(s=>s.id===r.toast.id?{...s,...r.toast}:s)};case 2:let{toast:a}=r;return pe(t,{type:t.toasts.find(s=>s.id===a.id)?1:0,toast:a});case 3:let{toastId:i}=r;return{...t,toasts:t.toasts.map(s=>s.id===i||i===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return r.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(s=>s.id!==r.toastId)};case 5:return{...t,pausedAt:r.time};case 6:let o=r.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+o}))}}},T=[],k={toasts:[],pausedAt:void 0},I=t=>{k=pe(k,t),T.forEach(r=>{r(k)})},et={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},tt=(t={})=>{let[r,a]=d.useState(k),i=d.useRef(k);d.useEffect(()=>(i.current!==k&&a(k),T.push(a),()=>{let s=T.indexOf(a);s>-1&&T.splice(s,1)}),[]);let o=r.toasts.map(s=>{var n,l,c;return{...t,...t[s.type],...s,removeDelay:s.removeDelay||((n=t[s.type])==null?void 0:n.removeDelay)||(t==null?void 0:t.removeDelay),duration:s.duration||((l=t[s.type])==null?void 0:l.duration)||(t==null?void 0:t.duration)||et[s.type],style:{...t.style,...(c=t[s.type])==null?void 0:c.style,...s.style}}});return{...r,toasts:o}},rt=(t,r="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Ge()}),$=t=>(r,a)=>{let i=rt(r,t,a);return I({type:2,toast:i}),i.id},_=(t,r)=>$("blank")(t,r);_.error=$("error");_.success=$("success");_.loading=$("loading");_.custom=$("custom");_.dismiss=t=>{I({type:3,toastId:t})};_.remove=t=>I({type:4,toastId:t});_.promise=(t,r,a)=>{let i=_.loading(r.loading,{...a,...a==null?void 0:a.loading});return typeof t=="function"&&(t=t()),t.then(o=>{let s=r.success?M(r.success,o):void 0;return s?_.success(s,{id:i,...a,...a==null?void 0:a.success}):_.dismiss(i),o}).catch(o=>{let s=r.error?M(r.error,o):void 0;s?_.error(s,{id:i,...a,...a==null?void 0:a.error}):_.dismiss(i)}),t};var st=(t,r)=>{I({type:1,toast:{id:t,height:r}})},at=()=>{I({type:5,time:Date.now()})},D=new Map,ot=1e3,it=(t,r=ot)=>{if(D.has(t))return;let a=setTimeout(()=>{D.delete(t),I({type:4,toastId:t})},r);D.set(t,a)},nt=t=>{let{toasts:r,pausedAt:a}=tt(t);d.useEffect(()=>{if(a)return;let s=Date.now(),n=r.map(l=>{if(l.duration===1/0)return;let c=(l.duration||0)+l.pauseDuration-(s-l.createdAt);if(c<0){l.visible&&_.dismiss(l.id);return}return setTimeout(()=>_.dismiss(l.id),c)});return()=>{n.forEach(l=>l&&clearTimeout(l))}},[r,a]);let i=d.useCallback(()=>{a&&I({type:6,time:Date.now()})},[a]),o=d.useCallback((s,n)=>{let{reverseOrder:l=!1,gutter:c=8,defaultPosition:m}=n||{},p=r.filter(f=>(f.position||m)===(s.position||m)&&f.height),x=p.findIndex(f=>f.id===s.id),j=p.filter((f,v)=>v<x&&f.visible).length;return p.filter(f=>f.visible).slice(...l?[j+1]:[0,j]).reduce((f,v)=>f+(v.height||0)+c,0)},[r]);return d.useEffect(()=>{r.forEach(s=>{if(s.dismissed)it(s.id,s.removeDelay);else{let n=D.get(s.id);n&&(clearTimeout(n),D.delete(s.id))}})},[r]),{toasts:r,handlers:{updateHeight:st,startPause:at,endPause:i,calculateOffset:o}}},lt=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ct=E`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,dt=E`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,mt=A("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${lt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ct} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${dt} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ut=E`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,xt=A("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${ut} 1s linear infinite;
`,pt=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ht=E`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ft=A("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ht} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,gt=A("div")`
  position: absolute;
`,yt=A("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,bt=E`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,jt=A("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${bt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,vt=({toast:t})=>{let{icon:r,type:a,iconTheme:i}=t;return r!==void 0?typeof r=="string"?d.createElement(jt,null,r):r:a==="blank"?null:d.createElement(yt,null,d.createElement(xt,{...i}),a!=="loading"&&d.createElement(gt,null,a==="error"?d.createElement(mt,{...i}):d.createElement(ft,{...i})))},_t=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,wt=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,Nt="0%{opacity:0;} 100%{opacity:1;}",Et="0%{opacity:1;} 100%{opacity:0;}",Ct=A("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,At=A("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ot=(t,r)=>{let a=t.includes("top")?1:-1,[i,o]=xe()?[Nt,Et]:[_t(a),wt(a)];return{animation:r?`${E(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${E(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},kt=d.memo(({toast:t,position:r,style:a,children:i})=>{let o=t.height?Ot(t.position||r||"top-center",t.visible):{opacity:0},s=d.createElement(vt,{toast:t}),n=d.createElement(At,{...t.ariaProps},M(t.message,t));return d.createElement(Ct,{className:t.className,style:{...o,...a,...t.style}},typeof i=="function"?i({icon:s,message:n}):d.createElement(d.Fragment,null,s,n))});Ze(d.createElement);var It=({id:t,className:r,style:a,onHeightUpdate:i,children:o})=>{let s=d.useCallback(n=>{if(n){let l=()=>{let c=n.getBoundingClientRect().height;i(t,c)};l(),new MutationObserver(l).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[t,i]);return d.createElement("div",{ref:s,className:r,style:a},o)},Pt=(t,r)=>{let a=t.includes("top"),i=a?{top:0}:{bottom:0},o=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:xe()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(a?1:-1)}px)`,...i,...o}},zt=q`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,R=16,Dt=({reverseOrder:t,position:r="top-center",toastOptions:a,gutter:i,children:o,containerStyle:s,containerClassName:n})=>{let{toasts:l,handlers:c}=nt(a);return d.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:R,left:R,right:R,bottom:R,pointerEvents:"none",...s},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(m=>{let p=m.position||r,x=c.calculateOffset(m,{reverseOrder:t,gutter:i,defaultPosition:r}),j=Pt(p,x);return d.createElement(It,{id:m.id,key:m.id,onHeightUpdate:c.updateHeight,className:m.visible?zt:"",style:j},m.type==="custom"?M(m.message,m):o?o(m):d.createElement(kt,{toast:m,position:p}))}))},tr=_;const $t=y.lazy(()=>b(()=>import("./Home-7xmnZpOI.js"),__vite__mapDeps([0,1,2,3,4,5]))),Lt=y.lazy(()=>b(()=>import("./About-BR8TppPn.js"),__vite__mapDeps([6,4,2,1,3]))),St=y.lazy(()=>b(()=>import("./Catalog-D8UyBjM-.js"),__vite__mapDeps([7,1,2,5,4,3]))),Rt=y.lazy(()=>b(()=>import("./Contact-DqzpzVBN.js"),__vite__mapDeps([8,2,4,1,3]))),Tt=y.lazy(()=>b(()=>import("./ProductDetail-B1RRmvxi.js"),__vite__mapDeps([9,2,3,10,11,4,12,5,1]))),Mt=y.lazy(()=>b(()=>import("./Cart-DIFNS8BL.js"),__vite__mapDeps([13,2,3,4,1]))),Vt=y.lazy(()=>b(()=>import("./Checkout-sDR-M_RK.js"),__vite__mapDeps([14,2,3,10,11,4,1]))),Ft=y.lazy(()=>b(()=>import("./Orders-D6mjRww2.js"),__vite__mapDeps([15,2,3,4,1]))),qt=y.lazy(()=>b(()=>import("./OrderDetail-Dg7XuOJc.js"),__vite__mapDeps([16,2,3,4,1]))),Ht=y.lazy(()=>b(()=>import("./Login-D9sJzP_7.js"),__vite__mapDeps([17,2,3,4,1]))),Ut=y.lazy(()=>b(()=>import("./Profile-DhNuBIOJ.js"),__vite__mapDeps([18,2,4,1,3]))),Jt=y.lazy(()=>b(()=>import("./AdminLogin-CvAIdL18.js"),__vite__mapDeps([19,2,3,4,1]))),Bt=y.lazy(()=>b(()=>import("./AdminSetup-BPyPIkUa.js"),__vite__mapDeps([20,2,3,4,1]))),Wt=y.lazy(()=>b(()=>import("./AdminDashboard-BJ-j1GL0.js"),__vite__mapDeps([21,2,3,4,1]))),Xt=y.lazy(()=>b(()=>import("./PrivacyPolicy-DyMSi1rw.js"),__vite__mapDeps([22,3,2,4,1]))),Yt=y.lazy(()=>b(()=>import("./TermsAndConditions-CFTU98qe.js"),__vite__mapDeps([23,3,2,4,1])));function Zt(){return e.jsx(Te,{children:e.jsx(Ve,{children:e.jsx(je,{children:e.jsxs("div",{className:"min-h-screen bg-gray-50 flex flex-col",children:[e.jsxs(Y,{children:[e.jsx(g,{path:"/admin/login",element:e.jsx(d.Suspense,{fallback:e.jsx(S,{}),children:e.jsx(Jt,{})})}),e.jsx(g,{path:"/admin/setup",element:e.jsx(d.Suspense,{fallback:e.jsx(S,{}),children:e.jsx(Bt,{})})}),e.jsx(g,{path:"/admin/dashboard",element:e.jsx(d.Suspense,{fallback:e.jsx(S,{}),children:e.jsx(He,{children:e.jsx(Wt,{})})})}),e.jsx(g,{path:"/*",element:e.jsxs(e.Fragment,{children:[e.jsx(Fe,{}),e.jsx("main",{className:"flex-grow",children:e.jsx(d.Suspense,{fallback:e.jsx(S,{}),children:e.jsxs(Y,{children:[e.jsx(g,{path:"/",element:e.jsx($t,{})}),e.jsx(g,{path:"/chi-siamo",element:e.jsx(Lt,{})}),e.jsx(g,{path:"/catalogo",element:e.jsx(St,{})}),e.jsx(g,{path:"/contatti",element:e.jsx(Rt,{})}),e.jsx(g,{path:"/privacy-policy",element:e.jsx(Xt,{})}),e.jsx(g,{path:"/terms-and-conditions",element:e.jsx(Yt,{})}),e.jsx(g,{path:"/prodotto/:id",element:e.jsx(Tt,{})}),e.jsx(g,{path:"/login",element:e.jsx(Ht,{})}),e.jsx(g,{path:"/carrello",element:e.jsx(z,{children:e.jsx(Mt,{})})}),e.jsx(g,{path:"/checkout",element:e.jsx(z,{children:e.jsx(Vt,{})})}),e.jsx(g,{path:"/ordini",element:e.jsx(z,{children:e.jsx(Ft,{})})}),e.jsx(g,{path:"/ordini/:orderId",element:e.jsx(z,{children:e.jsx(qt,{})})}),e.jsx(g,{path:"/profilo",element:e.jsx(z,{children:e.jsx(Ut,{})})})]})})}),e.jsx(qe,{})]})})]}),e.jsx(Dt,{position:"bottom-right",toastOptions:{duration:3e3,style:{borderRadius:"8px",background:"#333",color:"#fff"},success:{style:{background:"#10B981",color:"#fff"}},error:{style:{background:"#EF4444",color:"#fff"}}}})]})})})})}le(document.getElementById("root")).render(e.jsx(d.StrictMode,{children:e.jsx(Zt,{})}));export{tr as V,Me as a,e as j,F as u};
