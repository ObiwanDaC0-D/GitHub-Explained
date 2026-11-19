/* Pure state transitions for the guided Git simulator. No DOM or network access. */
function initialState(){return {cloned:false,branch:"main",edited:false,staged:false,local:0,remote:0,merged:false};}
function transition(state,action){
 const s={...state};let message="";
 if(action==="reset")return {state:initialState(),message:"Start by cloning."};
 if(action==="clone"){if(s.cloned)message="Already cloned. Continue with a branch.";else{s.cloned=true;message="Cloned: local main is ready.";}}
 else if(!s.cloned)message="Clone the repository first.";
 else if(action==="branch"){if(s.branch!=="main"||s.merged)message="Feature branch already exists or has been merged. Reset to start again.";else{s.branch="feature/tuner";message="Created feature/tuner. main is unchanged.";}}
 else if(action==="edit"){if(s.branch==="main"||s.merged)message="Create the feature branch first for this exercise.";else{s.edited=true;message="Saved code edits. No new commit yet.";}}
 else if(action==="stage"){if(!s.edited)message="Edit some files first.";else{s.staged=true;s.edited=false;message="Selected edits are staged for the next commit.";}}
 else if(action==="commit"){if(!s.staged)message="Stage changes before committing.";else{s.local++;s.staged=false;message="Created local commit #"+s.local+". GitHub is not updated yet.";}}
 else if(action==="push"){if(s.branch==="main")message="Switch to the feature branch to push feature commits.";else if(s.local===s.remote)message="Nothing new to push. Commit changes first.";else{s.remote=s.local;message="Pushed "+s.remote+" feature commit(s) to GitHub.";}}
 else if(action==="merge"){if(s.merged)message="Feature already merged. Reset to repeat the exercise.";else if(s.edited||s.staged)message="Commit or discard pending edits before merging.";else if(!s.remote)message="Push the feature branch first.";else if(s.local!==s.remote)message="Push your latest commits before merging.";else{s.merged=true;s.branch="main";message="Merged the published feature branch into main (simplified simulation).";}}
 else message="Unknown simulator action.";
 return {state:s,message};
}

/* Derive a conceptual branch diagram stage from Command Lab state. */
function timelineFromLab(lab){
 if(!lab||!lab.cloned)return {step:0,detail:"Clone a repository to begin."};
 const branches=Array.isArray(lab.branches)?lab.branches:[];
 if(lab.merged)return {step:4,detail:"Feature merged into main (simulated)."};
 if(!branches.includes("feature/tuner"))return {step:0,detail:"Repository cloned. Create feature/tuner."};
 const history=Array.isArray(lab.history)?lab.history:[];
 const count=history.filter(x=>x.branch==="feature/tuner").length;
 if(!count)return {step:1,detail:"Feature branch created. Edit, test, stage, and commit."};
 const pushed=Number(lab.remote?.["feature/tuner"]||0);
 if(pushed>=count)return {step:3,detail:count+" feature commit(s) published. Merge when ready."};
 return {step:2,detail:count+" local feature commit(s), "+pushed+" published."};
}
/* Deterministic, read-only commit graph derived from Command Lab history. */
function graphFromLab(lab){
 if(!lab?.cloned)return {nodes:[],edges:[],heads:{},remoteHeads:{},current:""};
 const history=Array.isArray(lab.history)?lab.history:[];
 const branches=Array.isArray(lab.branches)?lab.branches:["main"];
 const nodes=[{id:"base",branch:"main",message:"Initial commit",parent:null}];
 const edges=[];const heads={main:"base"};
 for(const branch of branches)if(branch!=="main")heads[branch]="base";
 history.forEach((entry,i)=>{
  const branch=entry.branch||"main",id="c"+(i+1),parent=heads[branch]||"base";
  nodes.push({id,branch,message:String(entry.message||"Commit"),parent});
  edges.push({from:parent,to:id,type:"commit"});heads[branch]=id;
 });
 if(lab.merged&&heads["feature/tuner"]){edges.push({from:heads["feature/tuner"],to:"merge",type:"merge"});edges.push({from:"base",to:"merge",type:"merge"});nodes.push({id:"merge",branch:"main",message:"Merge feature/tuner",parent:"base"});heads.main="merge";}
 const remoteHeads={};for(const [branch,count] of Object.entries(lab.remote||{})){if(branch==="main"){remoteHeads.main=lab.merged?"merge":"base";continue;}const commits=nodes.filter(n=>n.branch===branch);remoteHeads[branch]=count>0?commits[Math.min(count,commits.length)-1]?.id||"base":"base";}
 return {nodes,edges,heads,remoteHeads,current:lab.branch||"main"};
}
if(typeof window!=="undefined")window.GitSimulator={initialState,transition,timelineFromLab,graphFromLab};
