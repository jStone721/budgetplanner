import{initializeApp as w}from"https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";import{getAuth as A,onAuthStateChanged as B,signOut as O}from"https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";import{getFirestore as v,doc as $,getDoc as L}from"https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();const N={apiKey:"AIzaSyAkMccaMDOUcSrM7WcjwVZ3LP8rdWI1NAA",authDomain:"budgetplanner-952e3.firebaseapp.com",projectId:"budgetplanner-952e3",storageBucket:"budgetplanner-952e3.firebasestorage.app",messagingSenderId:"491817221899",appId:"1:491817221899:web:17352c66098004772b2c0e"},y=w(N);window.auth=A(y);window.db=v(y);const b=window.auth,C=window.db;let d=localStorage.getItem("email");B(b,e=>{e?(console.log("User is signed in:",e.email),d=e.email,m()):window.location.href="/auth.html"});const x=document.getElementById("logout-btn");x.addEventListener("click",async()=>{await O(b),window.location.href="/auth.html"});const p=document.getElementById("item-form"),u=document.getElementById("items"),F=document.getElementById("total-income"),M=document.getElementById("total-expenses"),P=document.getElementById("balance"),I=document.getElementById("category-filter"),f=document.getElementById("month-filter");let i=0,l=0;const m=()=>{u.innerHTML="",i=0,l=0,(JSON.parse(localStorage.getItem("budgetItems"))||[]).forEach(n=>{n.email===d&&(g(n),S(n))})},E=(e,n,t)=>{const a={id:Date.now().toString(),name:e||"Unnamed Item",amount:n,category:t,email:d,timestamp:new Date().toISOString()},o=JSON.parse(localStorage.getItem("budgetItems"))||[];o.push(a),localStorage.setItem("budgetItems",JSON.stringify(o)),g(a),S(a)};p.addEventListener("submit",e=>{e.preventDefault();const n=document.getElementById("item-name").value.trim(),t=parseFloat(document.getElementById("item-amount").value),a=document.getElementById("item-category").value;if(!n||isNaN(t)||t<=0){alert("Please enter a valid name and amount.");return}E(n,t,a),p.reset()});function g(e){const n=document.createElement("li");n.setAttribute("data-id",e.id),n.textContent=`${e.name} - $${e.amount} [${e.category}]`;const t=document.createElement("button");t.textContent="Edit",t.addEventListener("click",()=>D(e.id));const a=document.createElement("button");a.textContent="Delete",a.addEventListener("click",()=>J(e.id)),n.appendChild(t),n.appendChild(a),u.appendChild(n)}function S(e){e.category==="income"?i+=e.amount:l+=e.amount,F.textContent=`$${i}`,M.textContent=`$${l}`,P.textContent=`$${i-l}`}const D=e=>{const n=JSON.parse(localStorage.getItem("budgetItems"))||[],t=n.find(r=>r.id===e),a=prompt("Edit item name:",t.name),o=parseFloat(prompt("Edit amount:",t.amount));a&&!isNaN(o)&&(t.name=a,t.amount=o,localStorage.setItem("budgetItems",JSON.stringify(n)),m())},J=e=>{let n=JSON.parse(localStorage.getItem("budgetItems"))||[];n=n.filter(t=>t.id!==e),localStorage.setItem("budgetItems",JSON.stringify(n)),m()};I.addEventListener("change",()=>{const e=I.value,n=JSON.parse(localStorage.getItem("budgetItems"))||[];u.innerHTML="",n.forEach(t=>{t.email===d&&(e==="all"||t.category===e)&&g(t)})});f.addEventListener("change",()=>{const e=f.value,n=JSON.parse(localStorage.getItem("budgetItems"))||[],t=document.getElementById("monthly-list");t.innerHTML="",n.forEach(a=>{const o=new Date(a.timestamp),r=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`;if(a.email===d&&r===e){const c=document.createElement("li");c.textContent=`${a.name} - $${a.amount} [${a.category}]`,t.appendChild(c)}})});const K=async()=>{try{const e=$(C,"config","openai"),n=await L(e);if(n.exists()){const t=n.data().apiKey;return console.log("Fetched OpenAI Key from Firestore:",t),t}else console.error("No OpenAI API key found in Firestore.")}catch(e){console.error("Error fetching OpenAI API key from Firestore:",e)}},h=document.getElementById("chatbot-input"),U=document.getElementById("chatbot-send"),T=document.getElementById("chatbot-window"),s=(e,n)=>{const t=document.createElement("div");t.classList.add(e),t.textContent=`${e}: ${n}`,T.appendChild(t)},j=async e=>{const n=await K();if(!n){s("Bot","Unable to access AI services. Missing API Key.");return}try{const t=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"user",content:e}]})}),a=await t.json();if(t.ok){const o=a.choices[0].message.content;s("Bot",o),k(e.toLowerCase())}else console.error("OpenAI API Error:",a),s("Bot","Sorry, something went wrong with OpenAI.")}catch(t){console.error("Error calling OpenAI API:",t),s("Bot","Error connecting to AI.")}};U.addEventListener("click",async()=>{const e=h.value.trim();e&&(s("You",e),h.value="",await j(e))});const k=e=>{const n=/(buy|bought|spent|earned|received|got|income|expense)\s*(?:a|an|the)?\s*(.*?)\s*(?:for|of)?\s*\$?(\d+(\.\d{1,2})?)/i,t=e.match(n);if(t){const a=t[1].toLowerCase(),o=t[2]||"Unnamed Item",r=parseFloat(t[3]);let c="expense";["earned","received","income","got"].includes(a)&&(c="income"),E(o.trim(),r,c),s("Bot",`Added ${c} of $${r} for ${o}`);return}if(e.includes("delete all")||e.includes("remove all")){z(),s("Bot","All items deleted.");return}if(e.includes("balance")||e.includes("total")){s("Bot",`Your current balance is $${i-l}`);return}s("Bot","I couldn't understand the command. Please try again.")},z=()=>{localStorage.removeItem("budgetItems"),m(),s("Bot","All items have been deleted.")};
