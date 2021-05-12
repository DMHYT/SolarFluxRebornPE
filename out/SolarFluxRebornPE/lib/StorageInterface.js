LIBRARY({name:"StorageInterface",version:11,shared:!0,api:"CoreEngine"});var StorageInterface,LIQUID_STORAGE_MAX_LIMIT=99999999,NativeContainerInterface=function(){function t(t){this.isNativeContainer=!0,this.container=t}return t.prototype.getSlot=function(t){return this.container.getSlot(t)},t.prototype.setSlot=function(t,e,i,n,r){void 0===r&&(r=null),this.container.setSlot(t,e,i,n,r)},t.prototype.getContainerSlots=function(){for(var t=[],e=this.container.getSize(),i=0;i<e;i++)t.push(i);return t},t.prototype.getInputSlots=function(t){switch(this.container.getType()){case 1:case 38:case 39:return[1==t?0:1];case 8:return[1==t?0:4];default:return this.getContainerSlots()}},t.prototype.getReceivingItemCount=function(t,e){for(var i=0,n=0,r=this.getInputSlots(e);n<r.length;n++){var o=r[n],a=this.getSlot(o);if((0==a.id||a.id==t.id&&a.data==t.data)&&(i+=Item.getMaxStack(t.id)-a.count)>=t.count)break}return Math.min(t.count,i)},t.prototype.addItemToSlot=function(t,e,i){var n=this.getSlot(t),r=StorageInterface.addItemToSlot(e,n,i);return r>0&&this.setSlot(t,n.id,n.count,n.data,n.extra),r},t.prototype.addItem=function(t,e,i){void 0===i&&(i=64);for(var n=0,r=this.getInputSlots(e),o=0;o<r.length&&(n+=this.addItemToSlot(o,t,i),!(0==t.count||n>=i));o++);return n},t.prototype.getOutputSlots=function(){switch(this.container.getType()){case 1:case 38:case 39:return[2];case 8:return[1,2,3];default:return this.getContainerSlots()}},t.prototype.clearContainer=function(){for(var t=this.container.getSize(),e=0;e<t;e++)this.container.setSlot(e,0,0,0)},t}(),TileEntityInterface=function(){function t(t){this.liquidUnitRatio=1,this.isNativeContainer=!1,this.tileEntity=t,this.container=t.container;var e=StorageInterface.getData(t.blockID);if(e)for(var i in e)this[i]=e[i]}return t.prototype.getSlot=function(t){return this.container.getSlot(t)},t.prototype.setSlot=function(t,e,i,n,r){void 0===r&&(r=null),this.container.setSlot(t,e,i,n,r)},t.prototype.getSlotData=function(t){return this.slots?this.slots[t]:null},t.prototype.getSlotMaxStack=function(t){var e=this.getSlotData(t);return e&&e.maxStack||64},t.prototype.isValidSlotSide=function(t,e){if(null==t||-1==e)return!0;if("number"==typeof t)return t==e;switch(t){case"horizontal":return e>1;case"verctical":return e<=1;case"down":return 0==e;case"up":return 1==e}return!1},t.prototype.isValidSlotInput=function(t,e,i){var n=this.getSlotData(t);return!n||!n.isValid||n.isValid(e,i,this.tileEntity)},t.prototype.getContainerSlots=function(){return Object.keys(this.slots||this.container.slots)},t.prototype.getDefaultSlots=function(t){return this.tileEntity.getTransportSlots?this.tileEntity.getTransportSlots()[t]:this.getContainerSlots()},t.prototype.getInputSlots=function(t){if(void 0===t&&(t=-1),!this.slots)return this.getDefaultSlots("input");var e=[];for(var i in this.slots){var n=this.getSlotData(i);n.input&&this.isValidSlotSide(n.side,t)&&e.push(i)}return e},t.prototype.getReceivingItemCount=function(t,e){if(void 0===e&&(e=-1),!this.isValidInput(t,e,this.tileEntity))return 0;for(var i=0,n=0,r=this.getInputSlots(e);n<r.length;n++){var o=r[n];if(this.isValidSlotInput(o,t,e)){var a=this.getSlot(o);if(0==a.id||a.id==t.id&&a.data==t.data)if((i+=Math.min(Item.getMaxStack(t.id),this.getSlotMaxStack(o))-a.count)>=t.count)break}}return Math.min(t.count,i)},t.prototype.isValidInput=function(t,e,i){return!0},t.prototype.addItemToSlot=function(t,e,i){void 0===i&&(i=64);var n=this.getSlot(t),r=this.getSlotMaxStack(t),o=StorageInterface.addItemToSlot(e,n,Math.min(i,r));return o>0&&this.setSlot(t,n.id,n.count,n.data,n.extra),o},t.prototype.addItem=function(t,e,i){if(void 0===e&&(e=-1),void 0===i&&(i=64),!this.isValidInput(t,e,this.tileEntity))return 0;for(var n=0,r=0,o=this.getInputSlots(e);r<o.length;r++){var a=o[r];if(this.isValidSlotInput(a,t,e)&&(n+=this.addItemToSlot(a,t,i-n),0==t.count||n>=i))break}return n},t.prototype.getOutputSlots=function(t){if(void 0===t&&(t=-1),!this.slots)return this.getDefaultSlots("output");var e=[];for(var i in this.slots){var n=this.slots[i];if(n.output){var r=this.container.getSlot(i);0===r.id||!this.isValidSlotSide(n.side,t)||n.canOutput&&!n.canOutput(r,t,this.tileEntity)||e.push(i)}}return e},t.prototype.clearContainer=function(){for(var t in this.container.slots)this.container.clearSlot(t)},t.prototype.canReceiveLiquid=function(t,e){return this.getInputTank(e).getLimit(t)<LIQUID_STORAGE_MAX_LIMIT},t.prototype.canTransportLiquid=function(t,e){return!0},t.prototype.receiveLiquid=function(t,e,i){var n=t.getLiquidStored();return n&&n!=e?0:i-t.addLiquid(e,i/this.liquidUnitRatio)*this.liquidUnitRatio},t.prototype.extractLiquid=function(t,e,i){return t.getLiquid(e,i/this.liquidUnitRatio)*this.liquidUnitRatio},t.prototype.getInputTank=function(t){return this.tileEntity.liquidStorage},t.prototype.getOutputTank=function(t){return this.tileEntity.liquidStorage},t}();!function(t){function e(e,i){var n=t.directionsBySide[i];return{x:e.x+n.x,y:e.y+n.y,z:e.z+n.z}}function i(t){return"container"in t?new TileEntityInterface(t):"getParent"in t?new TileEntityInterface(t.getParent()):new NativeContainerInterface(t)}function n(t,e,i,n){var r=t.getBlockEntity(e,i,n);if(r&&r.getSize()>0)return new NativeContainerInterface(r);var o=World.getTileEntity(e,i,n,t);return o&&o.container&&o.__initialized?new TileEntityInterface(o):null}function r(t,e,i,n){var r=World.getTileEntity(e,i,n,t);return r&&r.__initialized?new TileEntityInterface(r):null}function o(t,i,n){var o=e(i,n);return r(t,o.x,o.y,o.z)}function a(t,e,n,r){return i(e).addItem(t,n,r)}function u(t,e,i,n,r){for(var o=0,a=0,u=e.getOutputSlots(1^i);a<u.length;a++){var s=u[a],c=e.getSlot(s);if(0!==c.id){var l=t.addItem(c,i,n-o);if(l>0&&(o+=l,e.setSlot(s,c.id,c.count,c.data,c.extra),r||o>=n))break}}return o}t.data={},t.getData=function(e){return t.data[e]},t.directionsBySide=[{x:0,y:-1,z:0},{x:0,y:1,z:0},{x:0,y:0,z:-1},{x:0,y:0,z:1},{x:-1,y:0,z:0},{x:1,y:0,z:0}],t.getRelativeCoords=e,t.setSlotMaxStackPolicy=function(t,e,i){t.setSlotAddTransferPolicy(e,function(t,e,n,r,o){var a=Math.min(i,Item.getMaxStack(n));return Math.max(0,Math.min(r,a-t.getSlot(e).count))})},t.setSlotValidatePolicy=function(t,e,i){t.setSlotAddTransferPolicy(e,function(t,e,n,r,o,a,u){return r=Math.min(r,Item.getMaxStack(n)-t.getSlot(e).count),i(e,n,r,o,a,t,u)?r:0})},t.setGlobalValidatePolicy=function(t,e){t.setGlobalAddTransferPolicy(function(t,i,n,r,o,a,u){return r=Math.min(r,Item.getMaxStack(n)-t.getSlot(i).count),e(i,n,r,o,a,t,u)?r:0})},t.getInterface=i,t.createInterface=function(e,i){if(i.slots){for(var n in i.slots)if(n.includes("^")){for(var r=i.slots[n],o=n.split("^"),a=o[1].split("-"),u=parseInt(a[0]);u<=parseInt(a[1]);u++)i.slots[o[0]+u]=r;delete i.slots[n]}}else i.slots={};t.data[e]=i},t.addItemToSlot=function(t,e,i){if(void 0===i&&(i=64),0==e.id||e.id==t.id&&e.data==t.data){var n=Item.getMaxStack(t.id),r=Math.min(t.count,n-e.count);if(i<r&&(r=i),r>0)return e.id=t.id,e.data=t.data,t.extra&&(e.extra=t.extra),e.count+=r,t.count-=r,0==t.count&&(t.id=t.data=0,t.extra=null),r}return 0},t.getStorage=n,t.getLiquidStorage=r,t.getNeighbourStorage=function(t,i,r){var o=e(i,r);return n(t,o.x,o.y,o.z)},t.getNeighbourLiquidStorage=o,t.getNearestContainers=function(t,i){var n=-1;"number"==typeof i&&(n=i=null);for(var r={},o=0;o<6;o++)if(!(n>=0&&o!=n)){var a=e(t,o),u=World.getContainer(a.x,a.y,a.z,i);u&&(r[o]=u)}return r},t.getNearestLiquidStorages=function(t,e){var i=-1;"number"==typeof e&&(i=e=null);for(var n={},r=0;r<6;r++)if(!(i>=0&&i!=r)){var a=o(e,t,r);a&&(n[r]=a)}return n},t.getContainerSlots=function(t){if("slots"in t)return Object.keys(t.slots);for(var e=[],i=t.getSize(),n=0;n<i;n++)e.push(n);return e},t.putItems=function(t,e){for(var i in t){var n=t[i];for(var r in e){if(0==n.count)break;a(n,e[r],1^parseInt(r))}}},t.putItemToContainer=a,t.extractItemsFromContainer=function(t,e,n,r,o){return u(i(t),i(e),n,r,o)},t.extractItemsFromStorage=u,t.extractLiquid=function(t,e,i,n,r){i instanceof TileEntityInterface||(i=new TileEntityInterface(i));var o=1^r,a=i.getInputTank(r),u=n.getOutputTank(o);if(!a||!u)return 0;if(t||(t=u.getLiquidStored()),t&&n.canTransportLiquid(t,o)&&i.canReceiveLiquid(t,r)&&!a.isFull(t)){var s=Math.min(u.getAmount(t)*n.liquidUnitRatio,e);return s=i.receiveLiquid(a,t,s),n.extractLiquid(u,t,s),s}return 0},t.transportLiquid=function(t,e,i,n,r){i instanceof TileEntityInterface||(i=new TileEntityInterface(i));var o=1^r,a=n.getInputTank(o),u=i.getOutputTank(r);if(!a||!u)return 0;if(n.canReceiveLiquid(t,o)&&!a.isFull(t)){var s=Math.min(u.getAmount(t)*i.liquidUnitRatio,e);return s=n.receiveLiquid(a,t,s),i.extractLiquid(u,t,s),s}return 0},t.checkHoppers=function(i){if(!(World.getThreadTime()%8>0)){for(var n=i.blockSource,r=t.getInterface(i),o=1;o<6;o++){var a=e(i,o),s=n.getBlock(a.x,a.y,a.z);154==s.id&&s.data==o+Math.pow(-1,o)&&u(r,t.getStorage(n,a.x,a.y,a.z),o,1)}154==n.getBlockId(i.x,i.y-1,i.z)&&u(t.getStorage(n,i.x,i.y-1,i.z),r,0,1)}}}(StorageInterface||(StorageInterface={})),Callback.addCallback("TileEntityAdded",function(t,e){e&&t.container.setParent(t),StorageInterface.data[t.blockID]&&(t.interface=new TileEntityInterface(t))}),EXPORT("StorageInterface",StorageInterface);