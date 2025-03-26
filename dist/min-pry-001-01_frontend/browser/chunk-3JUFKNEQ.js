import{a as A}from"./chunk-PS6PMMVB.js";import{f as C}from"./chunk-R2XLAL2B.js";import{a as Z,b as O}from"./chunk-GOSJJDVW.js";import"./chunk-MJOHIA6K.js";import{a as W,b as D}from"./chunk-AQMLQG24.js";import"./chunk-R25NPE2E.js";import{$ as T,I as f,Z as I,aa as R,ba as F,t as _,v as b,w as x,y as z,z as E}from"./chunk-KZFJR7EH.js";import{$ as v,Ab as g,Bb as y,Cb as M,Db as k,Ea as l,Fa as u,Ua as L,Wa as P,Za as B,d as w,db as o,eb as t,fb as h,kb as S,nc as N,rc as j,tb as a,ub as U,yb as p,zb as c}from"./chunk-VURLBMTQ.js";var ee=()=>({width:"100%",display:"block"}),te=()=>({width:"100%"});function ie(m,s){m&1&&(o(0,"div",14)(1,"h5"),a(2,"Verificando Credenciales..."),t(),h(3,"span",15),t())}var q=(()=>{let s=class s{constructor(i,r,e){this.route=i,this.messageService=r,this.authService=e,this.credencial={email:"",password:""},this.loading=!1}autenticarUser(){this.validarDatos(this.credencial)?(this.loading=!0,console.log("REQUEST->login",this.credencial),this.authService.login(this.credencial).subscribe({next:i=>{this.messageService.add({severity:"success",summary:"CONFIRMACI\xD3N",detail:i.msg}),console.log("RESPONSE->login",i),setTimeout(()=>w(this,null,function*(){yield this.navPantallaPrincipalUser()}),1e3)},error:i=>{this.messageService.add({severity:"error",summary:"ERROR",detail:i.error.msg}),console.log("RESPONSE->login Error en:",i.error)}})):(this.messageService.add({severity:"error",summary:"ERROR",detail:"Datos incorrectos...!!"}),console.log("Datos Incorrectos...!!"))}navPantallaPrincipalUser(){this.route.navigateByUrl("principal",{skipLocationChange:!1})}validarDatos(i){if(!i)return!1;let r=/^[a-zA-Z0-9._-]{1,30}@[a-zA-Z0-9.-]{1,30}\.[a-zA-Z]{2,6}$/,e=/^[a-zA-Z0-9._*-]{8,20}$/;return!!(r.test(i.email)&&e.test(i.password))}};s.\u0275fac=function(r){return new(r||s)(u(C),u(f),u(A))},s.\u0275cmp=v({type:s,selectors:[["app-login"]],standalone:!0,features:[y([f]),M],decls:22,vars:9,consts:[[1,"flex","justify-content-center"],[1,"surface-card","p-8","shadow-5","border-round","w-full","lg:w-6","my-5"],[1,"text-center","mb-5"],[1,"text-900","text-3xl","font-medium","mb-3"],[1,"text-600","font-medium","line-height-3"],[1,"field"],["for","login"],["type","text","pInputText","","id","login",1,"w-full",3,"ngModelChange","ngModel"],["for","password"],["id","password",1,"w-full",3,"ngModelChange","ngModel","toggleMask","inputStyle"],[1,"flex","align-items-center","justify-content-end","mb-6"],[1,"font-medium","no-underline","ml-2","text-blue-500","text-right","cursor-pointer"],["class","text-left mb-3",4,"ngIf"],["pButton","","pRipple","","label","Sign In","icon","pi pi-user",1,"w-full",3,"click"],[1,"text-left","mb-3"],[1,"saving"]],template:function(r,e){r&1&&(o(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),a(4,"AUTENTICACI\xD3N"),t(),o(5,"span",4),a(6,"Ingrese sus credenciales para acceder al Sistema"),t()(),o(7,"div")(8,"div",5)(9,"label",6),a(10,"Cuenta"),t(),o(11,"input",7),g("ngModelChange",function(n){return c(e.credencial.email,n)||(e.credencial.email=n),n}),t()(),o(12,"div",5)(13,"label",8),a(14,"Contrase\xF1a"),t(),o(15,"p-password",9),g("ngModelChange",function(n){return c(e.credencial.password,n)||(e.credencial.password=n),n}),t()(),o(16,"div",10)(17,"a",11),a(18,"Olvid\xF3 su contrase\xF1a?"),t()(),L(19,ie,4,0,"div",12),o(20,"button",13),S("click",function(){return e.autenticarUser()}),t()(),h(21,"p-toast"),t()()),r&2&&(l(11),p("ngModel",e.credencial.email),l(4),B(k(7,ee)),p("ngModel",e.credencial.password),P("toggleMask",!0)("inputStyle",k(8,te)),l(4),P("ngIf",e.loading))},dependencies:[T,I,O,Z,j,N,F,R,E,_,b,x,D,W]});let m=s;return m})();var V=(()=>{let s=class s{constructor(i,r,e){this.route=i,this.messageService=r,this.authService=e,this.usuario={login:"",email:"",password:"",password_confirmation:"",fechaInicio:"",fechaFin:"",descripcion:""}}navHome(){this.route.navigateByUrl("",{skipLocationChange:!1})}saveUsuario(){this.validarDatos(this.usuario)?this.authService.register(this.usuario).subscribe({next:()=>{this.showMessage(),setTimeout(()=>w(this,null,function*(){yield this.navLogin()}),2e3)},error:i=>this.error=i}):alert("Datos Incorrectos")}validarDatos(i){if(!i)return!1;let r=/^[a-zA-Z ]{1,50}/,e=/^[a-zA-Z0-9._-]{1,30}@[a-zA-Z0-9.-]{1,30}\.[a-zA-Z]{2,6}$/,d=/^[a-zA-Z0-9._*-]{8,20}$/,n=/^[a-zA-Z0-9._*-]{8,20}$/;return!!(r.test(i.login)&&e.test(i.email)&&d.test(i.password)&&n.test(i.password_confirmation))}navLogin(){this.route.navigateByUrl("auth/login",{skipLocationChange:!1})}showMessage(){this.messageService.add({severity:"success",summary:"Success",detail:"Message Content"})}};s.\u0275fac=function(r){return new(r||s)(u(C),u(f),u(A))},s.\u0275cmp=v({type:s,selectors:[["app-register"]],standalone:!0,features:[y([f]),M],decls:27,vars:5,consts:[[1,"flex","justify-content-center"],[1,"surface-card","p-8","shadow-5","border-round","w-full","lg:w-6","my-5"],[1,"text-center","mb-5"],[1,"text-900","text-3xl","font-medium","mb-3"],[1,"text-600","font-medium","line-height-3"],[1,"text-danger-600","font-medium","line-height-3"],["for","name",1,"block","text-900","font-medium","mb-2"],["id","name","type","text","placeholder","Ingrese su Nombre Completo...","pInputText","","required","",1,"w-full","mb-3",3,"ngModelChange","ngModel"],["for","email",1,"block","text-900","font-medium","mb-2"],["id","email","type","text","placeholder","Ingrese su Correo Electr\xF3nico...","pInputText","","required","",1,"w-full","mb-3",3,"ngModelChange","ngModel"],["for","password",1,"block","text-900","font-medium","mb-2"],["id","password","type","password","placeholder","Ingrese su Constrase\xF1a","pInputText","","required","",1,"w-full","mb-3",3,"ngModelChange","ngModel"],["for","password_confirmation",1,"block","text-900","font-medium","mb-2"],["id","password_confirmation","type","password","placeholder","Confirme su Constrase\xF1a","pInputText","","required","",1,"w-full","mb-3",3,"ngModelChange","ngModel"],[1,"flex","align-items-center","justify-content-end","mb-6"],[1,"font-medium","no-underline","ml-2","text-blue-500","text-right","cursor-pointer"],["pButton","","pRipple","","label","Sign In","icon","pi pi-usuarioRequest",1,"w-full",3,"click"]],template:function(r,e){r&1&&(o(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),a(4,"REGISTRO DE USUARIO"),t(),o(5,"span",4),a(6,"Ingrese sus datos para registrarse en el Sistema"),t(),o(7,"span",5),a(8),t()(),h(9,"p-toast"),o(10,"div")(11,"label",6),a(12,"Nombre"),t(),o(13,"input",7),g("ngModelChange",function(n){return c(e.usuario.login,n)||(e.usuario.login=n),n}),t(),o(14,"label",8),a(15,"Usuario"),t(),o(16,"input",9),g("ngModelChange",function(n){return c(e.usuario.email,n)||(e.usuario.email=n),n}),t(),o(17,"label",10),a(18,"Contrase\xF1a"),t(),o(19,"input",11),g("ngModelChange",function(n){return c(e.usuario.password,n)||(e.usuario.password=n),n}),t(),o(20,"label",12),a(21,"Confirmar Contrase\xF1a"),t(),o(22,"input",13),g("ngModelChange",function(n){return c(e.usuario.password_confirmation,n)||(e.usuario.password_confirmation=n),n}),t(),o(23,"div",14)(24,"a",15),a(25,"Olvid\xF3 su contrase\xF1a?"),t()(),o(26,"button",16),S("click",function(){return e.saveUsuario()}),t()()()()),r&2&&(l(8),U(e.error),l(5),p("ngModel",e.usuario.login),l(3),p("ngModel",e.usuario.email),l(3),p("ngModel",e.usuario.password),l(3),p("ngModel",e.usuario.password_confirmation))},dependencies:[T,I,F,R,E,_,b,z,x,D,W]});let m=s;return m})();var _e=[{path:"login",component:q},{path:"register",component:V}];export{_e as AuthRoutes};
