/* Pure state transitions for the guided Git simulator. No DOM or network access. */
export function initialState(){return {cloned:false,branch:"main",edited:false,staged:false,local:0,remote:0,merged:false};}
export function transition(state,action){
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
