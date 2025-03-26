import{K as P,S as X,T as Y,s as J,u as K}from"./chunk-KZFJR7EH.js";import{$ as N,Bb as O,Ea as a,Fa as p,Gb as _,Hb as G,Q as I,R as B,Ra as F,S as V,Ua as M,Va as r,Wa as l,Wb as Q,Yb as k,Zb as U,_a as C,aa as E,db as h,eb as m,fb as R,ja as d,jb as v,ka as c,kb as b,lb as g,lc as q,nc as W,oa as S,oc as z,pb as D,qb as j,rb as A,rc as H,sa as f,sb as y,tb as T,ub as L}from"./chunk-VURLBMTQ.js";var $=["input"],x=(o,s,e,i)=>({"p-radiobutton p-component":!0,"p-radiobutton-checked":o,"p-radiobutton-disabled":s,"p-radiobutton-focused":e,"p-variant-filled":i}),ee=(o,s,e)=>({"p-radiobutton-box":!0,"p-highlight":o,"p-disabled":s,"p-focus":e}),te=(o,s,e)=>({"p-radiobutton-label":!0,"p-radiobutton-label-active":o,"p-disabled":s,"p-radiobutton-label-focus":e});function ie(o,s){if(o&1){let e=v();h(0,"label",7),b("click",function(t){d(e);let n=g();return c(n.select(t))}),T(1),m()}if(o&2){let e=g(),i=y(3);C(e.labelStyleClass),l("ngClass",_(6,te,i.checked,e.disabled,e.focused)),r("for",e.inputId)("data-pc-section","label"),a(),L(e.label)}}var oe={provide:J,useExisting:I(()=>ae),multi:!0},ne=(()=>{class o{accessors=[];add(e,i){this.accessors.push([e,i])}remove(e){this.accessors=this.accessors.filter(i=>i[1]!==e)}select(e){this.accessors.forEach(i=>{this.isSameGroup(i,e)&&i[1]!==e&&i[1].writeValue(e.value)})}isSameGroup(e,i){return e[0].control?e[0].control.root===i.control.control.root&&e[1].name===i.name:!1}static \u0275fac=function(i){return new(i||o)};static \u0275prov=B({token:o,factory:o.\u0275fac,providedIn:"root"})}return o})(),ae=(()=>{class o{cd;injector;registry;config;value;formControlName;name;disabled;label;variant="outlined";tabindex;inputId;ariaLabelledBy;ariaLabel;style;styleClass;labelStyleClass;autofocus;onClick=new f;onFocus=new f;onBlur=new f;inputViewChild;onModelChange=()=>{};onModelTouched=()=>{};checked;focused;control;constructor(e,i,t,n){this.cd=e,this.injector=i,this.registry=t,this.config=n}ngOnInit(){this.control=this.injector.get(K),this.checkName(),this.registry.add(this.control,this)}handleClick(e,i,t){e.preventDefault(),!this.disabled&&(this.select(e),t&&i.focus())}select(e){this.disabled||(this.inputViewChild.nativeElement.checked=!0,this.checked=!0,this.onModelChange(this.value),this.registry.select(this),this.onClick.emit({originalEvent:e,value:this.value}))}writeValue(e){this.checked=e==this.value,this.inputViewChild&&this.inputViewChild.nativeElement&&(this.inputViewChild.nativeElement.checked=this.checked),this.cd.markForCheck()}registerOnChange(e){this.onModelChange=e}registerOnTouched(e){this.onModelTouched=e}setDisabledState(e){this.disabled=e,this.cd.markForCheck()}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onModelTouched(),this.onBlur.emit(e)}focus(){this.inputViewChild.nativeElement.focus()}ngOnDestroy(){this.registry.remove(this)}checkName(){this.name&&this.formControlName&&this.name!==this.formControlName&&this.throwNameError(),!this.name&&this.formControlName&&(this.name=this.formControlName)}throwNameError(){throw new Error(`
          If you define both a name and a formControlName attribute on your radio button, their values
          must match. Ex: <p-radioButton formControlName="food" name="food"></p-radioButton>
        `)}static \u0275fac=function(i){return new(i||o)(p(Q),p(S),p(ne),p(P))};static \u0275cmp=N({type:o,selectors:[["p-radioButton"]],viewQuery:function(i,t){if(i&1&&D($,5),i&2){let n;j(n=A())&&(t.inputViewChild=n.first)}},hostAttrs:[1,"p-element"],inputs:{value:"value",formControlName:"formControlName",name:"name",disabled:[2,"disabled","disabled",k],label:"label",variant:"variant",tabindex:[2,"tabindex","tabindex",U],inputId:"inputId",ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",style:"style",styleClass:"styleClass",labelStyleClass:"labelStyleClass",autofocus:[2,"autofocus","autofocus",k]},outputs:{onClick:"onClick",onFocus:"onFocus",onBlur:"onBlur"},features:[O([oe]),F],decls:7,vars:31,consts:[["input",""],[3,"click","ngStyle","ngClass"],[1,"p-hidden-accessible"],["type","radio","pAutoFocus","",3,"focus","blur","checked","disabled","value","autofocus"],[3,"ngClass"],[1,"p-radiobutton-icon"],[3,"class","ngClass","click",4,"ngIf"],[3,"click","ngClass"]],template:function(i,t){if(i&1){let n=v();h(0,"div",1),b("click",function(u){d(n);let Z=y(3);return c(t.handleClick(u,Z,!0))}),h(1,"div",2)(2,"input",3,0),b("focus",function(u){return d(n),c(t.onInputFocus(u))})("blur",function(u){return d(n),c(t.onInputBlur(u))}),m()(),h(4,"div",4),R(5,"span",5),m()(),M(6,ie,2,10,"label",6)}i&2&&(C(t.styleClass),l("ngStyle",t.style)("ngClass",G(22,x,t.checked,t.disabled,t.focused,t.variant==="filled"||t.config.inputStyle()==="filled")),r("data-pc-name","radiobutton")("data-pc-section","root"),a(),r("data-pc-section","hiddenInputWrapper"),a(),l("checked",t.checked)("disabled",t.disabled)("value",t.value)("autofocus",t.autofocus),r("id",t.inputId)("name",t.name)("aria-labelledby",t.ariaLabelledBy)("aria-label",t.ariaLabel)("tabindex",t.tabindex)("aria-checked",t.checked)("data-pc-section","hiddenInput"),a(2),l("ngClass",_(27,ee,t.checked,t.disabled,t.focused)),r("data-pc-section","input"),a(),r("data-pc-section","icon"),a(),l("ngIf",t.label))},dependencies:[q,W,z,X],encapsulation:2,changeDetection:0})}return o})(),_e=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=E({type:o});static \u0275inj=V({imports:[H,Y]})}return o})();export{_e as a};
