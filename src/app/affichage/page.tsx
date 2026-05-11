"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface Year { label: string; goal: number; collected: number; }
interface TV {
  nom: string; ville: string; projetTitre: string; projetResume: string;
  objectif: number; collecte: number; depenses: number;
  interac: string; description: string; qrUrl: string;
  tickerText: string; tickerDir: "ltr"|"rtl";
  facebook: string; whatsapp: string; instagram: string;
  years: Year[]; photos: string[];
}

const DEF: TV = {
  nom:"CCI de Montmagny", ville:"Montmagny, Québec", projetTitre:"", projetResume:"",
  objectif:50000, collecte:0, depenses:1000, interac:"Montmagny.ccim@gmail.com",
  description:"", qrUrl:"",
  tickerText:"جزاك الله خيراً على صدقتك — شكراً لك على دعمك للمسجد — بارك الله فيك",
  tickerDir:"rtl", facebook:"", whatsapp:"", instagram:"",
  years:[{label:"Année 1",goal:10000,collected:0},{label:"Année 2",goal:15000,collected:0},{label:"Année 3",goal:25000,collected:0}],
  photos:[],
};

const toN = (s:string|undefined, fb:number) => { const v=parseFloat(s??""); return isNaN(v)?fb:v; };
const fr2 = (v:number) => v.toLocaleString("fr-CA",{minimumFractionDigits:2,maximumFractionDigits:2});
const fr0 = (v:number) => v.toLocaleString("fr-CA",{minimumFractionDigits:0,maximumFractionDigits:0});

function Clock(){
  const [t,setT]=useState("");
  useEffect(()=>{
    const f=()=>setT(new Date().toLocaleTimeString("fr-CA",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    f(); const id=setInterval(f,1000); return ()=>clearInterval(id);
  },[]);
  return <span>{t}</span>;
}

const BAR_COLORS = [
  ["#C8A94E","#E8CB7A","rgba(200,169,78,0.5)"],
  ["#0D9488","#34D399","rgba(13,148,136,0.5)"],
  ["#7C3AED","#A78BFA","rgba(124,58,237,0.5)"],
  ["#B45309","#FCD34D","rgba(180,83,9,0.5)"],
  ["#BE185D","#F9A8D4","rgba(190,24,93,0.5)"],
];

export default function AffichagePage(){
  const [d,setD]=useState<TV>(DEF);
  const [live,setLive]=useState(false);
  const [mob,setMob]=useState(false);

  useEffect(()=>{
    const check=()=>setMob(window.innerWidth<768);
    check();
    window.addEventListener("resize",check);
    return ()=>window.removeEventListener("resize",check);
  },[]);

  const load=useCallback(async()=>{
    try{
      const [rows,photoRows]:[{title:string|null;body:string}[],{imageUrl?:string}[]]=await Promise.all([
        fetch(`/api/content?section=don&t=${Date.now()}`).then(r=>r.json()),
        fetch(`/api/content?section=don_photos&t=${Date.now()}`).then(r=>r.json()),
      ]);
      const g=(k:string)=>rows.find(r=>r.title===k)?.body;
      let years=DEF.years;
      try{const y=JSON.parse(g("years_plan")??"[]");if(Array.isArray(y)&&y.length)years=y;}catch{}
      const photos=photoRows.filter(r=>r.imageUrl).map(r=>r.imageUrl as string);
      // Compute totals from years plan if available
      const totalG=years.reduce((s,y)=>s+y.goal,0)||toN(g("objectif"),50000);
      const totalC=years.reduce((s,y)=>s+y.collected,0);
      setD({
        nom:g("nom_mosquee")??DEF.nom, ville:g("ville")??DEF.ville,
        projetTitre:g("projet_titre")??"",
        projetResume:g("projet_resume")??"",
        objectif:totalG, collecte:totalC,
        depenses:toN(g("depenses_fixes"),1000),
        interac:g("interac_email")??DEF.interac,
        description:g("description")??DEF.description,
        qrUrl:g("qr_code_url")??"",
        tickerText:g("ticker_text")??DEF.tickerText,
        tickerDir:(g("ticker_direction")??"rtl") as "ltr"|"rtl",
        facebook:g("share_facebook")??"",
        whatsapp:g("share_whatsapp")??"",
        instagram:g("social_instagram")??"",
        years, photos,
      });
      setLive(true); setTimeout(()=>setLive(false),800);
    }catch{}
  },[]);

  useEffect(()=>{load();},[load]);
  useEffect(()=>{const id=setInterval(load,30000);return()=>clearInterval(id);},[load]);

  const totalG = d.objectif;
  const totalC = d.collecte;
  const pct    = totalG>0?Math.min(100,Math.round(totalC/totalG*100)):0;
  const reste  = Math.max(0,totalG-totalC);

  const hasSocial = d.facebook||d.whatsapp||d.instagram;

  /* ── styles adaptatifs ── */
  const hH  = mob ? 56 : 72;
  const hPx = mob ? "0 16px" : "0 32px";
  const logoW = mob ? 36 : 48;

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"#06090F",
      color:"#F0F4FF",fontFamily:"'Inter',system-ui,sans-serif",
      overflowY: mob ? "auto" : "hidden", overflowX:"hidden"}}>

      {/* ══ HEADER ══ */}
      <div style={{display:"flex",alignItems:"center",padding:hPx,height:hH,flexShrink:0,
        position: mob ? "sticky" : "relative", top:0, zIndex:10,
        background:"linear-gradient(180deg,#090E1C,#06090F)",
        borderBottom:"1px solid rgba(200,169,78,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap: mob?10:16,flex:1,minWidth:0}}>
          <div style={{position:"relative",width:logoW,height:logoW,borderRadius:10,overflow:"hidden",
            background:"white",flexShrink:0,boxShadow:"0 0 0 2px rgba(200,169,78,0.3)"}}>
            <Image src="/ccimontmagny_logo.png" alt="" fill style={{objectFit:"contain",padding:4}}/>
          </div>
          <div style={{minWidth:0}}>
            <p style={{fontWeight:900,fontSize:mob?13:20,color:"#F0F4FF",lineHeight:1.1,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.nom}</p>
            {!mob&&<p style={{fontSize:12,color:"rgba(200,169,78,0.75)",marginTop:2}}>📍 {d.ville}</p>}
          </div>
        </div>

        {!mob&&(
          <p style={{fontSize:20,color:"rgba(232,203,122,0.9)",fontFamily:"serif",letterSpacing:"0.02em"}}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}

        <div style={{flex:1,textAlign:"right",display:"flex",flexDirection:"column",
          alignItems:"flex-end",gap:2}}>
          <p style={{fontSize:mob?20:30,fontWeight:900,fontVariantNumeric:"tabular-nums",
            letterSpacing:"0.03em",color:"#F0F4FF",lineHeight:1}}><Clock/></p>
          {!mob&&(
            <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",
              color:live?"#C8A94E":"rgba(255,255,255,0.2)",transition:"color 0.3s"}}>
              {live?"● ACTUALISÉ":"○ EN DIRECT"}
            </p>
          )}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{flex:1,display:"flex",flexDirection: mob ? "column" : "row",
        minHeight:0, overflow: mob ? "visible" : "hidden"}}>

        {/* ─── PANNEAU GAUCHE / HAUT ─── */}
        <div style={{
          width: mob ? "100%" : 380,
          flexShrink:0,
          display:"flex",flexDirection:"column",gap:0,
          borderRight: mob ? "none" : "1px solid rgba(200,169,78,0.12)",
          borderBottom: mob ? "1px solid rgba(200,169,78,0.12)" : "none",
          overflowY: mob ? "visible" : "auto",
        }}>

          {/* Bloc collecté */}
          <div style={{padding: mob?"16px":"24px 28px 20px",
            borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",
              color:"rgba(200,169,78,0.6)",marginBottom:8}}>Montant collecté</p>
            <p style={{fontSize:mob?42:58,fontWeight:900,color:"#4ADE80",lineHeight:1,
              letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums"}}>
              {fr2(totalC)}<span style={{fontSize:mob?20:26,marginLeft:4,color:"rgba(74,222,128,0.5)"}}>$</span>
            </p>
            <p style={{fontSize:mob?13:15,color:"rgba(255,255,255,0.3)",marginTop:6}}>
              sur <strong style={{color:"rgba(255,255,255,0.55)"}}>{fr0(totalG)} $</strong> objectif
            </p>
            <div style={{marginTop:12,height:10,borderRadius:9999,
              background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:9999,width:`${pct}%`,
                background:"linear-gradient(90deg,#C8A94E,#E8CB7A)",
                transition:"width 1.5s ease",boxShadow:"0 0 16px rgba(200,169,78,0.55)"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{fontSize:mob?16:20,fontWeight:900,color:"#E8CB7A"}}>{pct}%</span>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",alignSelf:"center"}}>
                {fr0(reste)} $ restant
              </span>
            </div>
          </div>

          {/* Bloc stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",
            borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{padding: mob?"12px 16px":"16px 20px",
              borderRight:"1px solid rgba(255,255,255,0.06)"}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",
                color:"rgba(200,169,78,0.5)",marginBottom:6}}>Objectif</p>
              <p style={{fontSize:mob?18:22,fontWeight:900,color:"#F0F4FF"}}>{fr0(totalG)} $</p>
            </div>
            <div style={{padding: mob?"12px 16px":"16px 20px"}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",
                color:"rgba(200,169,78,0.5)",marginBottom:6}}>Dép. / mois</p>
              <p style={{fontSize:mob?18:22,fontWeight:900,color:"#F0F4FF"}}>{fr0(d.depenses)} $</p>
            </div>
          </div>

          {/* Bloc Interac */}
          <div style={{padding: mob?"14px 16px":"20px 28px",
            borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",
              color:"rgba(200,169,78,0.6)",marginBottom:10}}>Don par Interac</p>
            <div style={{background:"rgba(200,169,78,0.07)",
              border:"1px solid rgba(200,169,78,0.2)",
              borderRadius:12,padding:"12px 16px",marginBottom:10}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",
                color:"rgba(200,169,78,0.6)",marginBottom:6}}>Courriel de virement</p>
              <p style={{fontSize:mob?14:16,fontWeight:900,color:"#E8CB7A",
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                lineHeight:1.3}}>{d.interac}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:5}}>
                Dépôt direct automatique
              </p>
            </div>
            <p style={{textAlign:"center",fontSize:mob?16:20,color:"#E8CB7A",fontFamily:"serif",lineHeight:2}}
              dir="rtl">جزاك الله خيراً على صدقتك</p>
            <p style={{textAlign:"center",fontSize:11,fontStyle:"italic",
              color:"rgba(255,255,255,0.3)",marginTop:2}}>
              Qu&apos;Allah vous accorde la bénédiction
            </p>
          </div>

          {/* Réseaux sociaux */}
          {hasSocial&&(
            <div style={{padding: mob?"14px 16px":"20px 28px",
              borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",
                color:"rgba(200,169,78,0.6)",marginBottom:12}}>Nous rejoindre</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {d.facebook&&(
                  <SocialRow svgIcon={FB_ICON} label="Facebook" value={d.facebook}
                    href={d.facebook.startsWith("http")?d.facebook:`https://facebook.com/${d.facebook}`}
                    color="#1877F2" bg="rgba(24,119,242,0.1)" border="rgba(24,119,242,0.25)" mob={mob}/>
                )}
                {d.whatsapp&&(
                  <SocialRow svgIcon={WA_ICON} label="WhatsApp" value={d.whatsapp}
                    href={d.whatsapp.startsWith("http")?d.whatsapp:`https://wa.me/${d.whatsapp.replace(/[^0-9]/g,"")}`}
                    color="#25D366" bg="rgba(37,211,102,0.08)" border="rgba(37,211,102,0.25)" mob={mob}/>
                )}
                {d.instagram&&(
                  <SocialRow svgIcon={IG_ICON} label="Instagram" value={d.instagram}
                    href={d.instagram.startsWith("http")?d.instagram:`https://instagram.com/${d.instagram.replace("@","")}`}
                    color="#C13584" bg="rgba(193,53,132,0.08)" border="rgba(193,53,132,0.25)" mob={mob}/>
                )}
              </div>
            </div>
          )}

          {/* QR */}
          {d.qrUrl&&(
            <div style={{padding: mob?"12px 16px":"16px 28px",
              display:"flex",alignItems:"center",gap:14}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.qrUrl} alt="QR"
                style={{width:mob?56:68,height:mob?56:68,background:"white",
                  borderRadius:10,padding:3,flexShrink:0}}/>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:"rgba(200,169,78,0.6)"}}>Visiter notre site</p>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:3}}>ccimontmagny.ca</p>
              </div>
            </div>
          )}

          {!mob&&(
            <>
              <div style={{flex:1}}/>
              <div style={{padding:"12px 28px",textAlign:"center"}}>
                <button onClick={load}
                  style={{background:"transparent",border:"1px solid rgba(200,169,78,0.2)",
                    color:"rgba(200,169,78,0.5)",borderRadius:8,padding:"6px 16px",
                    fontSize:11,fontWeight:600,cursor:"pointer"}}>
                  🔄 Actualiser
                </button>
              </div>
            </>
          )}
        </div>

        {/* ─── PANNEAU DROIT / BAS : BARRES ─── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",
          padding: mob?"16px":"24px 32px",
          gap:0, overflowY: mob?"visible":"auto"}}>

          {/* Titre + résumé du projet */}
          {(d.projetTitre||d.projetResume)&&(
            <div style={{marginBottom:16,paddingBottom:14,borderBottom:"1px solid rgba(200,169,78,0.12)"}}>
              {d.projetTitre&&(
                <p style={{fontSize:mob?16:22,fontWeight:900,color:"#F0F4FF",lineHeight:1.2,marginBottom:6}}>
                  🏗 {d.projetTitre}
                </p>
              )}
              {d.projetResume&&(
                <p style={{fontSize:mob?11:13,color:"rgba(255,255,255,0.45)",lineHeight:1.6,fontStyle:"italic"}}>
                  {d.projetResume}
                </p>
              )}
            </div>
          )}
          <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",
            color:"rgba(200,169,78,0.5)",marginBottom:4}}>Plan de financement pluriannuel</p>
          {d.description&&(
            <p style={{fontSize:13,color:"rgba(255,255,255,0.3)",marginBottom:14,
              fontStyle:"italic"}}>{d.description}</p>
          )}

          {/* Year bars */}
          <div style={{display:"flex",flexDirection:"column",gap:12,flex:1}}>
            {d.years.map((yr,i)=>{
              const [cFrom,cTo,glow]=BAR_COLORS[i%BAR_COLORS.length];
              const p=yr.goal>0?Math.min(100,Math.round(yr.collected/yr.goal*100)):0;
              const done=p>=100;
              return(
                <div key={i} style={{background:"rgba(255,255,255,0.025)",
                  border:`1px solid ${done?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.06)"}`,
                  borderRadius:16,padding: mob?"16px":"22px 28px",
                  position:"relative",overflow:"hidden",flexShrink:0}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,
                    borderRadius:"16px 0 0 16px",
                    background:`linear-gradient(180deg,${cFrom},${cTo})`}}/>
                  <div style={{display:"flex",alignItems:"center",
                    justifyContent:"space-between",marginBottom:12,paddingLeft:10}}>
                    <div>
                      <p style={{fontSize:mob?18:24,fontWeight:900,lineHeight:1,
                        color:done?"#4ADE80":"#F0F4FF",letterSpacing:"-0.01em"}}>
                        {yr.label}{done?" ✅":""}
                      </p>
                      <p style={{fontSize:mob?12:14,color:"rgba(255,255,255,0.3)",marginTop:4}}>
                        Objectif : <strong style={{color:"rgba(255,255,255,0.5)"}}>{fr2(yr.goal)} $</strong>
                      </p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <p style={{fontSize:mob?34:48,fontWeight:900,lineHeight:1,
                        letterSpacing:"-0.03em",color:done?"#4ADE80":cTo}}>
                        {p}<span style={{fontSize:mob?20:28}}>%</span>
                      </p>
                      <p style={{fontSize:mob?12:14,color:"rgba(255,255,255,0.3)",marginTop:3}}>
                        {fr2(yr.collected)} $
                      </p>
                    </div>
                  </div>
                  <div style={{paddingLeft:10}}>
                    <div style={{height:mob?14:22,borderRadius:9999,
                      background:"rgba(255,255,255,0.05)",overflow:"hidden",position:"relative"}}>
                      <div style={{height:"100%",borderRadius:9999,width:`${p}%`,
                        background:`linear-gradient(90deg,${cFrom},${cTo})`,
                        transition:"width 2s cubic-bezier(0.4,0,0.2,1)",
                        boxShadow:`0 0 20px ${glow}`}}>
                        {p>10&&(
                          <span style={{position:"absolute",right:8,top:"50%",
                            transform:"translateY(-50%)",fontSize:10,fontWeight:900,
                            color:"rgba(0,0,0,0.5)"}}>
                            {p}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                      <span style={{fontSize:10,color:"rgba(255,255,255,0.18)"}}>0 $</span>
                      <span style={{fontSize:10,color:"rgba(255,255,255,0.18)"}}>{fr2(yr.goal)} $</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Photos du projet */}
          {d.photos.length>0&&(
            <div style={{marginTop:16,flexShrink:0}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",
                color:"rgba(200,169,78,0.5)",marginBottom:8}}>Photos du projet</p>
              <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4,
                scrollbarWidth:"none"}}>
                {d.photos.map((url,i)=>(
                  <div key={i} style={{flexShrink:0,width:mob?110:150,height:mob?75:100,
                    borderRadius:12,overflow:"hidden",
                    border:"1px solid rgba(200,169,78,0.2)"}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ayah */}
          <div style={{marginTop:16,background:"rgba(200,169,78,0.05)",
            border:"1px solid rgba(200,169,78,0.15)",borderRadius:14,
            padding: mob?"14px 16px":"18px 24px",textAlign:"center",flexShrink:0}}>
            <p style={{fontSize:mob?17:22,lineHeight:2.2,fontFamily:"serif",color:"#E8CB7A"}} dir="rtl">
              لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ
            </p>
            <p style={{fontSize:mob?11:13,fontStyle:"italic",color:"rgba(255,255,255,0.3)",marginTop:6}}>
              Vous n&apos;atteindrez la vraie piété que si vous dépensez de ce que vous chérissez. — Al-Imran 3:92
            </p>
          </div>

          {/* Bouton actualiser (mobile seulement) */}
          {mob&&(
            <div style={{padding:"16px 0",textAlign:"center"}}>
              <button onClick={load}
                style={{background:"transparent",border:"1px solid rgba(200,169,78,0.2)",
                  color:"rgba(200,169,78,0.5)",borderRadius:8,padding:"8px 20px",
                  fontSize:13,fontWeight:600,cursor:"pointer"}}>
                🔄 Actualiser
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══ TICKER ══ */}
      <div style={{height:46,flexShrink:0,overflow:"hidden",
        background:"rgba(200,169,78,0.05)",
        borderTop:"1px solid rgba(200,169,78,0.15)",
        display:"flex",alignItems:"center",
        position: mob ? "sticky" : "relative", bottom:0}}>
        <Ticker text={d.tickerText} dir={d.tickerDir}/>
      </div>
    </div>
  );
}

/* Extract profile name from URL */
function profileName(val: string): string {
  try {
    const u = val.startsWith("http") ? new URL(val) : null;
    const path = u ? u.pathname.replace(/\/+$/,"").split("/").filter(Boolean).pop() ?? val : val;
    return path.startsWith("@") ? path : "@"+path;
  } catch { return val; }
}

const FB_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);
const WA_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const IG_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#igGrad)">
    <defs>
      <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F58529"/>
        <stop offset="50%" stopColor="#DD2A7B"/>
        <stop offset="100%" stopColor="#515BD4"/>
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

function SocialRow({svgIcon,label,value,href,color,bg,border,mob}:
  {svgIcon:React.ReactNode;label:string;value:string;href:string;color:string;bg:string;border:string;mob:boolean}){
  const display = profileName(value);
  return(
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{display:"flex",alignItems:"center",gap:12,
        padding: mob?"10px 12px":"13px 16px",
        borderRadius:12,background:bg,border:`1px solid ${border}`,
        textDecoration:"none",cursor:"pointer",transition:"filter 0.2s"}}
      onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.18)")}
      onMouseLeave={e=>(e.currentTarget.style.filter="brightness(1)")}>
      <span style={{flexShrink:0,display:"flex",alignItems:"center"}}>{svgIcon}</span>
      <div style={{minWidth:0,flex:1}}>
        <p style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",
          color,opacity:0.75,marginBottom:2}}>{label}</p>
        <p style={{fontSize:mob?14:16,fontWeight:800,color:"rgba(255,255,255,0.9)",
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{display}</p>
      </div>
      <span style={{fontSize:16,color,opacity:0.5,flexShrink:0}}>↗</span>
    </a>
  );
}

function Ticker({text,dir}:{text:string;dir:"ltr"|"rtl"}){
  const dur=Math.max(24,text.length*0.14);
  const nm=dir==="rtl"?"kRtl":"kLtr";
  const kf=dir==="rtl"
    ?`@keyframes kRtl{from{transform:translateX(-15%)}to{transform:translateX(110vw)}}`
    :`@keyframes kLtr{from{transform:translateX(110vw)}to{transform:translateX(-100%)}}`;
  return(
    <>
      <style>{kf}</style>
      <p dir={dir} style={{whiteSpace:"nowrap",paddingLeft:40,
        fontSize:dir==="rtl"?17:15,fontWeight:700,
        color:"#D4AF6A",
        fontFamily:dir==="rtl"?"serif":"system-ui,sans-serif",
        animation:`${nm} ${dur}s linear infinite`,willChange:"transform"}}>
        {text}&emsp;·&emsp;{text}&emsp;·&emsp;{text}
      </p>
    </>
  );
}
