function StringToBitmap(t){try{return encodeByte=android.util.Base64.decode(t,0),bitmap=android.graphics.BitmapFactory.decodeByteArray(encodeByte,0,encodeByte.length),bitmap}catch(t){return null}}function getScrollY(t){let e=t.layout;var a=0;try{for(;;)a+=e.getScrollY(),e=e.getChildAt(0)}catch(t){}return a}function createAnim(t,e,a){var o=JAVA_ANIMATOR.ofFloat(t);return o.setDuration(e),a&&o.addUpdateListener({onAnimationUpdate:function(t){a(t.getAnimatedValue(),t)}}),JAVA_HANDLER_THREAD.post({run:function(){o.start()}}),o}function defaultOptions(){return{anim:{speed:200,bonusSize:0}}}function defaultChestData(){return{container:null,currentWindow:null,start:!1,item:{maxCount:0,count:0},barData:{name:"",x:0,y:0},pre_selectedSlot:null,selectedSlot:null,selectedSlotType:null,lastClickTime:0,anim:{pos1:{slotSize:0,window:null,x:0,y:0},pos2:{x:0,y:0}}}}function addEventListener(t,e){t.addServerEventListener(e,function(t,a,o){defaultFunctions[e](t,o,a)})}function registerServerEventsForContainer(t){for(let e in defaultFunctions)addEventListener(t,e)}function registerForWindow(t,e,a){function o(t,e,o,n){var i=t.getContent(),l="$slot"+ ++uniqueId_,s={x:chestData.anim.pos1.x,y:chestData.anim.pos1.y},r={x:chestData.anim.pos2.x,y:chestData.anim.pos2.y};i.elements[l]={type:"slot",x:s.x-o/2,y:s.y-o/2,size:(o||70)+a.bonusSize,source:{id:e.id,count:1,data:e.data,extra:e.extra||null},bitmap:"_default_slot_empty",visual:!0},t.forceRefresh();var c=t.getElements(),d=createAnim([0,1],a.speed,function(e){if(t.isOpened()){var c=s.x+(r.x-s.x)*e,d=s.y+(r.y-s.y)*e,u=t.getElements().get(l),_=Math.round(o+(n-o)*e+a.bonusSize);i.elements[l].size=_,i.elements[l].x=c-_/2,i.elements[l].y=d-_/2,u.setPosition(c-_/2,d-_/2),t.forceRefresh()}});d.addListener({onAnimationEnd:function(){if(delete i.elements[l],t.isOpened()){var e=t.getElementProvider();e.removeElement(c.get(l)),t.forceRefresh()}}})}function n(t,e){currentSlotType="frame"==this.type?0:1,slotSize=this.size||this.slot_size||60;var a=t.window.getContent().elements;a.scale1___.scale=60/108*slotSize/15,a.selection1___.width=a.selection1___.height=slotSize;var n=this.slot_id||this.slot_id___||0,i=t.window.getContainer();chestData.container=i.getParent(),chestData.currentWindow=t.window;var l=currentSlotType?chestData.container.getSlot(n):Player.getInventorySlot(n);event_type=e.type;var d=t.window.getElements();if("CLICK"==e.type&&null!=chestData.selectedSlot){if(chestData.selectedSlot==n){if(chestData.selectedSlot=null,chestData.selectedSlotType=null,java.lang.System.currentTimeMillis()-chestData.lastClickTime<=500){var u=Item.getMaxStack(l.id);if(l.count<u){var _=u-l.count,m=chestData.container.slots,S=getScrollY(t.window);t.window;if(chestData.anim.pos2={window:t.window,x:t.window.location.windowToGlobal(this.x+slotSize/2)+t.window.location.x,y:t.window.location.windowToGlobal(this.y+slotSize/2-S/t.window.getScale())+t.window.location.y},currentSlotType){for(var h in m)if("$"!=h[0]){var g=m[h];if(g&&h!=n&&g.id==l.id&&g.data==l.data&&(g.extra==l.extra||(!g.extra||g.extra.getAllCustomData())==(!l.extra||l.extra.getAllCustomData()))){var y=Math.min(g.count,_);_-=y,chestData.container.sendEvent("SlotToSlot",{slot1:h,slot2:n,count:y});var w=c[h];if(w){var D=getScrollY(w),x=w.getContent().elements;if(chestData.anim.pos1={window:w,slotSize:x[h].size||60,x:w.location.windowToGlobal(x[h].x+x[h].size/2)+w.location.x,y:w.location.windowToGlobal(x[h].y+x[h].size/2-D/w.getScale())+w.location.y},o(s,chestData.container.getSlot(h),w.location.windowToGlobal(chestData.anim.pos1.slotSize),t.window.location.windowToGlobal(slotSize)),_<=0)break}}}if(_>0)for(h=0;h<=35;h++){g=Player.getInventorySlot(h);if(g&&g.id==l.id&&g.data==l.data&&(g.extra==l.extra||(!g.extra||g.extra.getAllCustomData())==(!l.extra||l.extra.getAllCustomData()))){y=Math.min(g.count,_);_-=y,chestData.container.sendEvent("InventorySlotToContainerSlot",{slot1:h,slot2:n,count:y});w=c[r[h]];if(w){D=getScrollY(w),x=w.getContent().elements;if(chestData.anim.pos1={window:w,slotSize:x[r[h]].size||60,x:w.location.windowToGlobal(x[r[h]].x+x[r[h]].size/2)+w.location.x,y:w.location.windowToGlobal(((x[r[h]].y+x[r[h]].size/2)*w.getScale()-D)/w.getScale())+w.location.y},o(s,Player.getInventorySlot(h),w.location.windowToGlobal(chestData.anim.pos1.slotSize),t.window.location.windowToGlobal(slotSize)),_<=0)break}}}}else{u=Item.getMaxStack(l.id);if(l.count<u){for(h=0;h<=35;h++){g=Player.getInventorySlot(h);if(g&&h!=n&&g.id==l.id&&g.data==l.data&&(g.extra==l.extra||(!g.extra||g.extra.getAllCustomData())==(!l.extra||l.extra.getAllCustomData()))){y=Math.min(g.count,_);_-=y,chestData.container.sendEvent("InventorySlotToSlot",{slot1:h,slot2:n,count:y});w=c[r[h]];if(w){D=getScrollY(w),x=w.getContent().elements;if(chestData.anim.pos1={window:w,slotSize:x[r[h]].size||60,x:w.location.windowToGlobal(x[r[h]].x+x[r[h]].size/2)+w.location.x,y:w.location.windowToGlobal(((x[r[h]].y+x[r[h]].size/2)*w.getScale()-D)/w.getScale())+w.location.y},o(s,Player.getInventorySlot(h),w.location.windowToGlobal(chestData.anim.pos1.slotSize),t.window.location.windowToGlobal(slotSize)),_<=0)break}}}if(_>0)for(var h in m)if("$"!=h[0]){g=m[h];if(g&&g.id==l.id&&g.data==l.data&&(g.extra==l.extra||(!g.extra||g.extra.getAllCustomData())==(!l.extra||l.extra.getAllCustomData()))){y=Math.min(g.count,_);_-=y,chestData.container.sendEvent("SlotToInventorySlot",{slot1:h,slot2:n,count:y});w=c[h];if(w){D=getScrollY(w),x=w.getContent().elements;if(chestData.anim.pos1={window:w,slotSize:x[h].size||60,x:w.location.windowToGlobal(x[h].x+x[h].size/2)+w.location.x,y:w.location.windowToGlobal(x[h].y+x[h].size/2-D/w.getScale())+w.location.y},o(s,chestData.container.getSlot(h),w.location.windowToGlobal(chestData.anim.pos1.slotSize),t.window.location.windowToGlobal(this.slot_size)),_<=0)break}}}}}}}var v=chestData.anim.pos1.window||t.window,f=v.getElements();return f.containsKey("scale1___")&&f.get("scale1___").setPosition(-300,-300),d.containsKey("scale1___")&&d.get("scale1___").setPosition(-300,-300),chestData.container.setScale("scale1___",0),f.containsKey("selection1___")&&f.get("selection1___").setPosition(-1e3,-1e3),void(d.containsKey("selection1___")&&d.get("selection1___").setPosition(-1e3,-1e3))}chestData.item.count=Math.min(Math.floor(chestData.item.count),chestData.item.maxCount),currentSlotType?0==chestData.selectedSlotType?chestData.container.sendEvent("InventorySlotToContainerSlot",{slot1:chestData.selectedSlot,slot2:n,count:chestData.item.count}):chestData.container.sendEvent("SlotToSlot",{slot1:chestData.selectedSlot,slot2:n,count:chestData.item.count}):0==chestData.selectedSlotType?chestData.container.sendEvent("InventorySlotToSlot",{slot1:chestData.selectedSlot,slot2:n,count:chestData.item.count}):chestData.container.sendEvent("SlotToInventorySlot",{slot1:chestData.selectedSlot,slot2:n,count:chestData.item.count});S=getScrollY(t.window);chestData.anim.pos2={x:t.window.location.windowToGlobal(this.x+slotSize/2)+t.window.location.x,y:t.window.location.windowToGlobal(this.y+slotSize/2-S/t.window.getScale())+t.window.location.y};v=chestData.anim.pos1.window,f=v.getElements(),D=getScrollY(v);var A=chestData.anim.pos1.slotSize||250;chestData.anim.pos1.x=v.location.windowToGlobal(chestData.anim.pos1.pre_x+A/2)+v.location.x,chestData.anim.pos1.y=v.location.windowToGlobal(((chestData.anim.pos1.pre_y+A/2)*v.getScale()-D)/v.getScale())+v.location.y,o(s,chestData.selectedSlotType?chestData.container.getSlot(chestData.selectedSlot):Player.getInventorySlot(chestData.selectedSlot),v.location.windowToGlobal(A),t.window.location.windowToGlobal(slotSize));var p={window:chestData.anim.pos2,x:chestData.anim.pos2.x,y:chestData.anim.pos2.y};chestData.anim.pos2=chestData.anim.pos1,chestData.anim.pos1=p;g=chestData.selectedSlotType?chestData.container.getSlot(chestData.selectedSlot):Player.getInventorySlot(chestData.selectedSlot);return 0!=l.id&&(g.id!=l.id||g.count>Item.getMaxStack(l.id)-l.count)&&o(s,l,t.window.location.windowToGlobal(slotSize),chestData.anim.pos2.window.location.windowToGlobal(chestData.anim.pos2.slotSize||251)),f.containsKey("scale1___")&&f.get("scale1___").setPosition(-300,-300),d.containsKey("scale1___")&&d.get("scale1___").setPosition(-300,-300),chestData.container.setScale("scale1___",0),f.containsKey("selection1___")&&f.get("selection1___").setPosition(-1e3,-1e3),d.containsKey("selection1___")&&d.get("selection1___").setPosition(-1e3,-1e3),chestData.selectedSlot=null,void(chestData.selectedSlotType=null)}if("CANCEL"==e.type&&(event_type="UP"),"CLICK"==e.type&&(event_type="UP"),"DOWN"==event_type){if(0==l.id||null!=chestData.selectedSlot)return;chestData.item={maxCount:l.count,count:1},chestData.pre_selectedSlot=n,chestData.start=World.getThreadTime()+10,chestData.tickStarted=!1,chestData.barData={name:"scale1___",x:this.x+(slotSize-15*a.scale1___.scale)/2,y:this.y},t.window.forceRefresh(),d.get("selection1___").setPosition(this.x,this.y),chestData.lastClickTime=java.lang.System.currentTimeMillis(),chestData.anim.pos1={window:t.window,slotSize:slotSize,pre_x:this.x,pre_y:this.y}}if("UP"==event_type){if(null!=chestData.selectedSlot||!chestData.start)return;chestData.start=!1,chestData.selectedSlot=n,chestData.selectedSlotType=currentSlotType,chestData.pre_selectedSlot=null,chestData.tickStarted||(chestData.item.count=chestData.item.maxCount)}}a=Object.assign({speed:250,bonusSize:2},a||{});var i=!!t.getWindow,l=i?t.getAllWindows().get(t.getAllWindows().size()-1):t;overlayWindow_object={location:{x:0,y:0,width:1e3,height:UI.getScreenHeight()},drawing:[{type:"color",color:android.graphics.Color.TRANSPARENT}],elements:{}};var s=i?t.addWindow("overlay",overlayWindow_object):new UI.Window(overlayWindow_object);s.setAsGameOverlay(!0),s.setTouchable(!1),l.setEventListener({onClose:function(){i||s.close()},onOpen:function(t){var e=t.getElements();e.get("selection1___")&&e.get("selection1___").setPosition(-1e3,-1e3),e.get("scale1___")&&e.get("scale1___").setPosition(-1e3,-1e3),chestData.selectedSlot=null,chestData.selectedSlotType=null,i||s.open()}});var r={},c={},d={elements:{}},u=i?t.getAllWindows().toArray():[t];for(var _ in u){var m=u[_];if(!s||s!=m){l!=m&&m.setEventListener({onClose:function(){},onOpen:function(t){var e=t.getElements();e.get("selection1___")&&e.get("selection1___").setPosition(-1e3,-1e3),e.get("scale1___")&&e.get("scale1___").setPosition(-1e3,-1e3)}});var S=m.getContent();for(var h in S.elements.scale1___={type:"scale",x:-300,y:-300,z:100001,direction:0,bitmap:"___transferBarFull",background:"___transferBarEmpty",value:0,scale:60/108*100/15},S.elements.selection1___={type:"image",x:-1e3,y:-1e3,z:1e5,bitmap:"style:selection",width:100,height:100},S.elements)-1==S.elements[h].type.indexOf("slot")&&-1==S.elements[h].type.indexOf("Slot")||S.elements[h].clicker||S.elements[h].visual||S.elements[h].onTouchEvent||("invSlot"!=S.elements[h].type?(S.elements[h].visual=!0,S.elements[h].slot_id___=h,S.elements[h].onTouchEvent=n):(r[S.elements[h].index]=h,S.elements["_CLICKFRAME_"+ ++uniqueId_]={type:"frame",x:S.elements[h].x,y:S.elements[h].y,z:-100,width:S.elements[h].size||60,height:S.elements[h].size||60,bitmap:"_default_slot_empty",slot_id:S.elements[h].index||0,slot_size:S.elements[h].size||60,slot_textid:h,scale:1,onTouchEvent:n}));for(var _ in Object.assign(d.elements,S.elements),S.elements)c[_]=m;m.forceRefresh()}}e&&registerServerEventsForContainer(e)}function registerForTile(t,e){Callback.addCallback("PreLoaded",function(){var e=TileEntity.tileEntityPrototypes[t];if(!e)throw"Tile entity with "+t+" id not registered";var a=a||e.getScreenByName("main");if(!a)throw"Cannot be get window from tileentity("+t+") please pass it as the second parameter";entityTypeName=e.networkEntityTypeName,e.__init_______________=e.init,e.init=function(){registerServerEventsForContainer(this.container),this.__init_______________&&this.__init_______________()},registerForWindow(a)})}LIBRARY({name:"VanillaSlots",version:3,shared:!0,api:"CoreEngine"});var _TextureSource=WRAP_JAVA("com.zhekasmirnov.innercore.api.mod.ui.TextureSource");_TextureSource=_TextureSource.instance,_TextureSource.put("___transferBarFull",StringToBitmap("iVBORw0KGgoAAAANSUhEUgAAAA8AAAADCAIAAADDdsJmAAAAEUlEQVR4AWNk+M9APGCkoWoADp8DAS0NIF4AAAAASUVORK5CYII=")),_TextureSource.put("___transferBarEmpty",StringToBitmap("iVBORw0KGgoAAAANSUhEUgAAAA8AAAADCAIAAADDdsJmAAAAEklEQVR4AWP08fFlIBow0lA1APMhArOjizwiAAAAAElFTkSuQmCC"));var JAVA_ANIMATOR=android.animation.ValueAnimator,JAVA_HANDLER=android.os.Handler,LOOPER_THREAD=android.os.Looper,JAVA_HANDLER_THREAD=new JAVA_HANDLER(LOOPER_THREAD.getMainLooper());Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(t,e){"use strict";if(null==t)throw new TypeError("Cannot convert first argument to object");for(var a=Object(t),o=1;o<arguments.length;o++){var n=arguments[o];if(null!=n)for(var i=Object.keys(Object(n)),l=0,s=i.length;l<s;l++){var r=i[l],c=Object.getOwnPropertyDescriptor(n,r);void 0!==c&&c.enumerable&&(a[r]=n[r])}}return a}});var chestData=defaultChestData(),defaultFunctions={SlotToSlot:function(t,e,a){var o=t.getSlot(e.slot1).asScriptable(),n=t.getGetTransferPolicy(e.slot1),i=t.getSlot(e.slot2).asScriptable(),l=t.getAddTransferPolicy(e.slot2);if((i.id!=o.id||i.data!=o.data||i.extra!=o.extra&&(!i.extra||i.extra.getAllCustomData())!=(!o.extra||o.extra.getAllCustomData()))&&0!=i.id)return t.setSlot(e.slot1,i.id,i.count,i.data,i.extra),t.setSlot(e.slot2,o.id,o.count,o.data,o.extra),void t.sendChanges();var s=0!=i.id?Math.min(e.count,Item.getMaxStack(i.id)-i.count):e.count;s<=0||(n&&(s=null!=(transferCount=n.transfer(t,e.slot1,o.id,s,o.data,o.extra,a.getPlayerUid()))&&null!=transferCount?transferCount:s),s<=0||(l&&(s=null!=(transferCount=l.transfer(t,e.slot2,o.id,s,o.data,o.extra,a.getPlayerUid()))&&null!=transferCount?transferCount:s),s<=0||(t.setSlot(e.slot2,o.id,0!=i.id?i.count+s:s,o.data,o.extra),t.setSlot(e.slot1,o.id,o.count-s,o.data,o.extra),t.getSlot(e.slot1).validate(),t.sendChanges())))},InventorySlotToSlot:function(t,e,a){var o=new PlayerActor(a.getPlayerUid()),n=o.getInventorySlot(e.slot1),i=o.getInventorySlot(e.slot2);if((i.id!=n.id||i.data!=n.data||i.extra!=n.extra&&(!i.extra||i.extra.getAllCustomData())!=(!n.extra||n.extra.getAllCustomData()))&&0!=i.id)return o.setInventorySlot(e.slot1,i.id,i.count,i.data,i.extra),void o.setInventorySlot(e.slot2,n.id,n.count,n.data,n.extra);var l=0!=i.id?Math.min(e.count,Item.getMaxStack(i.id)-i.count):e.count;l<=0||(o.setInventorySlot(e.slot1,n.id,n.count-l,n.data,n.extra),o.setInventorySlot(e.slot2,n.id,0!=i.id?i.count+l:l,n.data,n.extra))},SlotToInventorySlot:function(t,e,a){var o=new PlayerActor(a.getPlayerUid()),n=t.getSlot(e.slot1).asScriptable(),i=t.getGetTransferPolicy(e.slot1),l=o.getInventorySlot(e.slot2);if((l.id!=n.id||l.data!=n.data||l.extra!=n.extra&&(!l.extra||l.extra.getAllCustomData())!=(!n.extra||n.extra.getAllCustomData()))&&0!=l.id)return o.setInventorySlot(e.slot2,n.id,n.count,n.data,n.extra),t.setSlot(e.slot1,l.id,l.count,l.data,l.extra),void t.sendChanges();var s=0!=l.id?Math.min(e.count,Item.getMaxStack(l.id)-l.count):e.count;s<=0||(i&&(s=null!=(transferCount=i.transfer(t,e.slot1,n.id,s,n.data,n.extra,a.getPlayerUid()))&&null!=transferCount?transferCount:s),o.setInventorySlot(e.slot2,n.id,0!=l.id?l.count+s:s,n.data,n.extra),t.setSlot(e.slot1,n.id,n.count-s,n.data,n.extra),t.getSlot(e.slot1).validate(),t.sendChanges())},InventorySlotToContainerSlot:function(t,e,a){var o=new PlayerActor(a.getPlayerUid()),n=o.getInventorySlot(e.slot1),i=t.getSlot(e.slot2).asScriptable(),l=t.getAddTransferPolicy(e.slot2);if((i.id!=n.id||i.data!=n.data||i.extra!=n.extra&&(!i.extra||i.extra.getAllCustomData())!=(!n.extra||n.extra.getAllCustomData()))&&0!=i.id)return o.setInventorySlot(e.slot1,i.id,i.count,i.data,i.extra),t.setSlot(e.slot2,n.id,n.count,n.data,n.extra),void t.sendChanges();var s=0!=i.id?Math.min(e.count,Item.getMaxStack(i.id)-i.count):e.count;s<=0||(l&&(s=null!=(transferCount=l.transfer(t,e.slot2,n.id,s,n.data,n.extra,a.getPlayerUid()))&&null!=transferCount?transferCount:s),s<=0||(o.setInventorySlot(e.slot1,n.id,n.count-s,n.data,n.extra),t.setSlot(e.slot2,n.id,0!=i.id?i.count+s:s,n.data,n.extra),t.sendChanges()))}},uniqueId_=0;Callback.addCallback("LocalTick",function(){if(chestData.start&&World.getThreadTime()>=chestData.start&&chestData.item.count<chestData.item.maxCount&&chestData.currentWindow){var t=chestData.currentWindow.getElements(),e=t.get(chestData.barData.name);chestData.tickStarted=!0,chestData.item.count+=chestData.item.maxCount/25,e&&(e.setPosition(chestData.barData.x,chestData.barData.y),e.setBinding("value",chestData.item.maxCount>15?chestData.item.count/chestData.item.maxCount:Math.floor(chestData.item.count)/chestData.item.maxCount))}});var VanillaSlots_={registerServerEventsForContainer:registerServerEventsForContainer,registerForWindow:registerForWindow,registerForTile:registerForTile};EXPORT("VanillaSlots",VanillaSlots_);