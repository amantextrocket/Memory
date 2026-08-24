const STORE="MEMORY_DEMO_V4";
const defaultData={
 shops:[{id:"SHOP001",name:"Aman Mobile",admin:"Shop Admin",pin:"1234",plan:"Premium",active:true,expiry:"2026-09-24",theme:"default"}],
 ui:{
  dashboardTitle:"दुकान का पूरा काम एक जगह।",
  dashboardSubtitle:"MEMORY Mobile Shop Workspace",
  modules:{
   phones:{label:"New Phones",desc:"Stock & sale",enabled:true},
   second:{label:"Second-Hand",desc:"Buy & sell",enabled:true},
   accessories:{label:"Accessories",desc:"Stock & sale",enabled:true},
   purchase:{label:"Purchase",desc:"Supplier & purchase",enabled:true},
   sales:{label:"Sales",desc:"Phone & accessories sales",enabled:true},
   inventory:{label:"Inventory",desc:"Stock In / Stock Out",enabled:true},
   repair:{label:"Repairing",desc:"Job cards",enabled:true},
   customers:{label:"Customers",desc:"Customer records",enabled:true},
   billing:{label:"Billing",desc:"Invoice & PDF",enabled:true},
   reports:{label:"Reports",desc:"Sales & profit",enabled:true},
   subscription:{label:"Subscription",desc:"Plan & renewal",enabled:true}
  }
 }
};
let data=loadData(), currentShop=null;

function loadData(){try{return JSON.parse(localStorage.getItem(STORE))||structuredClone(defaultData)}catch(e){return structuredClone(defaultData)}}
function saveData(){localStorage.setItem(STORE,JSON.stringify(data))}
function toast(msg){const x=document.getElementById("toast");x.textContent=msg;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function toggleTheme(){document.body.classList.toggle("dark")}
function toggleSidebar(){document.getElementById("sidebar").classList.toggle("open")}
function toggleSuperSidebar(){document.getElementById("superSidebar").classList.toggle("open")}

function shopLogin(){
 const id=document.getElementById("shopId").value.trim(),pin=document.getElementById("shopPin").value.trim();
 const s=data.shops.find(x=>x.id===id&&x.pin===pin);
 if(!s)return toast("Shop Admin details गलत हैं");
 if(!s.active)return toast("यह shop अभी suspended है");
 currentShop=s;
 document.getElementById("shopLogin").classList.add("hidden");
 document.getElementById("shopApp").classList.remove("hidden");
 document.getElementById("shopNameSide").textContent=s.name;
 document.getElementById("shopUserName").textContent=s.admin;
 document.getElementById("shopUserId").textContent=s.id;
 buildShopNav();renderShop("dashboard");
}
function buildShopNav(){
 const m=data.ui.modules;
 const list=[["dashboard","▦","Dashboard"],["phones","📱",m.phones.label],["second","♻",m.second.label],["accessories","◈",m.accessories.label],["purchase","↓",m.purchase.label],["sales","↑",m.sales.label],["inventory","▣",m.inventory.label],["repair","⚒",m.repair.label],["customers","♙",m.customers.label],["billing","▤",m.billing.label],["reports","◒",m.reports.label],["subscription","◇",m.subscription.label]];
 document.getElementById("shopNav").innerHTML=list.filter(x=>x[0]==="dashboard"||m[x[0]]?.enabled).map(x=>`<button class="nav" data-page="${x[0]}" onclick="renderShop('${x[0]}')">${x[1]}<span>${x[2]}</span></button>`).join("");
}
function stat(v,l,t=""){return `<div class="card stat"><small>${l}</small><strong>${v}</strong><div class="trend">${t}</div></div>`}
function tile(icon,title,desc,page){return `<button class="tile" onclick="renderShop('${page}')"><div class="icon">${icon}</div><b>${title}</b><small>${desc}</small></button>`}
function table(){return `<div class="table-wrap"><table class="table"><tr><th>ID</th><th>Customer</th><th>Details</th><th>Amount</th><th>Status</th></tr><tr><td>MEM-1042</td><td>Rahul</td><td>iPhone 15</td><td>₹55,000</td><td><span class="badge">PAID</span></td></tr><tr><td>MEM-1041</td><td>Aman</td><td>Accessories</td><td>₹7,499</td><td><span class="badge">PAID</span></td></tr><tr><td>MEM-1040</td><td>Neha</td><td>Samsung A56</td><td>₹34,999</td><td><span class="badge warn">DUE</span></td></tr></table></div>`}
function renderShop(p){
 const m=data.ui.modules;
 document.getElementById("shopPageTitle").textContent=p==="dashboard"?"Dashboard":(m[p]?.label||p);
 document.querySelectorAll("#shopNav .nav").forEach(n=>n.classList.toggle("active",n.dataset.page===p));
 let c;
 if(p==="dashboard") c=`<div class="hero"><div><span class="eyebrow">SHOP ADMIN</span><h1>${data.ui.dashboardTitle}</h1><div class="muted">${data.ui.dashboardSubtitle}</div></div><div class="actions"><button class="primary" onclick="renderShop('sales')">+ ${m.sales.label}</button></div></div><div class="stats">${stat("₹48,500","आज की Sales","+12.5%")}${stat("₹7,840","आज का Profit","+8.2%")}${stat("42","Phone Stock","8 low stock")}${stat("186","Accessories","24 sold")}</div><div class="section"><div class="grid">${["phones","second","accessories","repair"].filter(k=>m[k].enabled).map(k=>tile(k==="phones"?"📱":k==="second"?"♻":k==="accessories"?"◈":"⚒",m[k].label,m[k].desc,k)).join("")}</div></div><div class="section card"><div class="section-head"><h3>Recent Activity</h3><button class="secondary" onclick="toast('Search')">Search</button></div>${table()}</div>`;
 else if(p==="subscription") c=`<div class="hero"><div><span class="eyebrow">SUBSCRIPTION</span><h1>${m.subscription.label}</h1><div class="muted">Current plan: ${currentShop.plan}</div></div><button class="primary" onclick="toast('Payment gateway बाद में connect होगा')">Renew Now</button></div><div class="card"><h3>${currentShop.name}</h3><p>Plan: <b>${currentShop.plan}</b></p><p>Expiry: <b>${currentShop.expiry}</b></p><span class="badge">ACTIVE</span></div>`;
 else c=`<div class="hero"><div><span class="eyebrow">MEMORY MODULE</span><h1>${m[p]?.label||p}</h1><div class="muted">${m[p]?.desc||"Module"}</div></div><button class="primary" onclick="toast('Add New')">+ Add New</button></div><div class="section card"><div class="section-head"><h3>Recent Activity</h3></div>${table()}</div>`;
 document.getElementById("shopContent").innerHTML=c;
 document.getElementById("sidebar").classList.remove("open");
}

function initSuper(){
 document.getElementById("shopLogin").classList.add("hidden");
 document.getElementById("superLogin").classList.remove("hidden");
}
function superLogin(){
 if(document.getElementById("superId").value.trim()!=="SUPER001"||document.getElementById("superPin").value.trim()!=="2580")return toast("Super Admin details गलत हैं");
 document.getElementById("superLogin").classList.add("hidden");document.getElementById("superApp").classList.remove("hidden");buildSuperNav();renderSuper("dashboard");
}
function buildSuperNav(){
 const list=[["dashboard","▦","Dashboard"],["shops","⌂","Shops"],["control","◆","Shop Control"],["plans","◫","Plans"],["payments","₹","Payments"],["settings","⚙","Settings"]];
 document.getElementById("superNav").innerHTML=list.map(x=>`<button class="nav" data-page="${x[0]}" onclick="renderSuper('${x[0]}')">${x[1]}<span>${x[2]}</span></button>`).join("");
}
function shopOptions(selected){return data.shops.map(s=>`<option value="${s.id}" ${s.id===selected?"selected":""}>${s.id} · ${s.name}</option>`).join("")}
function renderSuper(p){
 document.getElementById("superPageTitle").textContent=p==="dashboard"?"Dashboard":p==="control"?"Shop Control":p[0].toUpperCase()+p.slice(1);
 document.querySelectorAll("#superNav .nav").forEach(n=>n.classList.toggle("active",n.dataset.page===p));
 let c="";
 if(p==="dashboard")c=`<div class="hero"><div><span class="eyebrow">SUPER ADMIN</span><h1>MEMORY Master Dashboard</h1><div class="muted">हर shop का पूरा control एक जगह।</div></div><button class="primary" onclick="renderSuper('shops')">+ Create Shop</button></div><div class="stats">${stat(data.shops.length,"Total Shops")}${stat(data.shops.filter(x=>x.active).length,"Active Shops")}${stat("₹"+(data.shops.length*999).toLocaleString("en-IN"),"Monthly Potential","+8.2%")}${stat(data.shops.filter(x=>x.expiry<"2026-09-02").length,"Expiring Soon")}</div><div class="section card"><div class="section-head"><h3>Shops</h3><button class="secondary" onclick="renderSuper('shops')">Manage</button></div>${shopsTable()}</div>`;
 else if(p==="shops")c=`<div class="hero"><div><span class="eyebrow">SHOP MANAGEMENT</span><h1>All Shops</h1><div class="muted">Create और manage rented shops.</div></div><button class="primary" onclick="newShopForm()">+ Create Shop</button></div><div class="card">${shopsTable()}</div>`;
 else if(p==="control")c=controlPage();
 else if(p==="plans")c=`<div class="hero"><div><span class="eyebrow">SUBSCRIPTION</span><h1>Plans</h1></div></div><div class="grid"><div class="card"><h3>Basic</h3><h1>₹499</h1><p>Core modules</p></div><div class="card"><h3>Standard</h3><h1>₹699</h1><p>Inventory + billing</p></div><div class="card"><h3>Premium</h3><h1>₹999</h1><p>All modules</p></div></div>`;
 else if(p==="payments")c=`<div class="hero"><div><span class="eyebrow">PAYMENTS</span><h1>Payments</h1></div></div><div class="stats">${stat("₹"+(data.shops.length*999).toLocaleString("en-IN"),"Monthly Potential")}${stat(data.shops.length,"Subscriptions")}${stat("0","Failed")}${stat("0","Refunds")}</div>`;
 else c=settingsPage();
 document.getElementById("superContent").innerHTML=c;
}
function shopsTable(){return `<div class="table-wrap"><table class="table"><tr><th>Shop</th><th>Admin</th><th>Plan</th><th>Expiry</th><th>Status</th><th>Action</th></tr>${data.shops.map(s=>`<tr><td><b>${s.name}</b><br><small>${s.id}</small></td><td>${s.admin}</td><td>${s.plan}</td><td>${s.expiry}</td><td><span class="badge ${s.active?"":"bad"}">${s.active?"ACTIVE":"SUSPENDED"}</span></td><td><button class="secondary" onclick="editShop('${s.id}')">Edit</button></td></tr>`).join("")}</table></div>`}
function newShopForm(){document.getElementById("superContent").innerHTML=shopForm({id:"",name:"",admin:"Shop Admin",pin:"",plan:"Premium",active:true,expiry:""},"create")}
function editShop(id){const s=data.shops.find(x=>x.id===id);document.getElementById("superContent").innerHTML=shopForm(s,"edit")}
function shopForm(s,mode){return `<div class="hero"><div><span class="eyebrow">SHOP CONTROL</span><h1>${mode==="create"?"Create Shop":"Edit Shop"}</h1></div></div><div class="card"><div class="form-grid"><div class="field"><label>Shop ID</label><input id="fId" value="${s.id}" ${mode==="edit"?"disabled":""}></div><div class="field"><label>Shop Name</label><input id="fName" value="${s.name}"></div><div class="field"><label>Shop Admin Name</label><input id="fAdmin" value="${s.admin}"></div><div class="field"><label>Shop Admin PIN</label><input id="fPin" value="${s.pin}"></div><div class="field"><label>Plan</label><select id="fPlan"><option ${s.plan==="Basic"?"selected":""}>Basic</option><option ${s.plan==="Standard"?"selected":""}>Standard</option><option ${s.plan==="Premium"?"selected":""}>Premium</option></select></div><div class="field"><label>Expiry</label><input id="fExpiry" type="date" value="${s.expiry}"></div></div><div class="actions" style="margin-top:15px"><button class="primary" onclick="saveShop('${mode}','${s.id}')">Save Shop</button><button class="secondary" onclick="renderSuper('shops')">Cancel</button></div></div>`}
function saveShop(mode,oldId){const s={id:document.getElementById("fId").value.trim(),name:document.getElementById("fName").value.trim()||"New Shop",admin:document.getElementById("fAdmin").value.trim()||"Shop Admin",pin:document.getElementById("fPin").value.trim()||"1234",plan:document.getElementById("fPlan").value,active:true,expiry:document.getElementById("fExpiry").value||"2026-09-24"};if(!s.id)return toast("Shop ID जरूरी है");if(mode==="create"&&data.shops.some(x=>x.id===s.id))return toast("Shop ID already exists");if(mode==="create")data.shops.push(s);else Object.assign(data.shops.find(x=>x.id===oldId),s);saveData();toast("Shop saved");renderSuper("shops")}
function controlPage(){
 const id=window.controlShop||data.shops[0].id, s=data.shops.find(x=>x.id===id)||data.shops[0],m=data.ui.modules;
 return `<div class="hero"><div><span class="eyebrow">CENTRAL CONTROL</span><h1>Shop Admin Control</h1><div class="muted">Text, modules और settings यहाँ से control करें।</div></div><select class="shop-select" onchange="window.controlShop=this.value;renderSuper('control')">${shopOptions(id)}</select></div>
 <div class="card"><div class="section-head"><h3>${s.name} · UI Control</h3><button class="primary" onclick="saveControls()">Save Changes</button></div>
 <div class="control-row"><b>Dashboard Title</b><input id="ctlTitle" value="${data.ui.dashboardTitle}"><span></span></div>
 <div class="control-row"><b>Dashboard Subtitle</b><input id="ctlSub" value="${data.ui.dashboardSubtitle}"><span></span></div>
 ${Object.entries(m).map(([k,v])=>`<div class="control-row"><div><b>${k}</b><br><small class="muted">Menu text / description</small></div><input data-label="${k}" value="${v.label}"><label class="switch"><span>ON</span><input data-enable="${k}" type="checkbox" ${v.enabled?"checked":""}></label></div>`).join("")}
 </div>`;
}
function saveControls(){
 data.ui.dashboardTitle=document.getElementById("ctlTitle").value;
 data.ui.dashboardSubtitle=document.getElementById("ctlSub").value;
 document.querySelectorAll("[data-label]").forEach(i=>data.ui.modules[i.dataset.label].label=i.value);
 document.querySelectorAll("[data-enable]").forEach(i=>data.ui.modules[i.dataset.enable].enabled=i.checked);
 saveData();toast("Shop control saved");renderSuper("control");
}
function settingsPage(){return `<div class="hero"><div><span class="eyebrow">SUPER ADMIN</span><h1>Platform Settings</h1></div></div><div class="card"><h3>Demo Frontend Storage</h3><p>अभी data browser LocalStorage में save हो रहा है। Firebase बाद में जोड़ने पर यही architecture real database में जाएगा।</p></div>`}

const path=location.pathname.toLowerCase().replace(/\/+$/,"");
if(path.endsWith("/superadmin"))initSuper();
else document.getElementById("shopLogin").classList.remove("hidden");
