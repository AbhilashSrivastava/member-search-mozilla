import * as fabric from 'fabric';
import colors from '$lib/constants/colors'
import origin from '$lib/constants/origin'

export class Fabric {
    /**
     * @type {{ group: fabric.Group; member: any; }[]}
     */
    groupMemberList
    /**
     * @type {fabric.Canvas}
     */
    canvasInstance
    cardDimension
    canvasDimension
    totalColumns
    padding = 20
    isPanning
    lastPosX
    lastPosY
    isZoomPanSettingEnabled
    /**
     * @param {string | HTMLCanvasElement} canvasElement
     * @param {{width: number;height: number;}} cardDimension
     * @param {{height: number;width: number;}} canvasDimension
     * @param {number} totalColumns
     * @param {number} padding
     * @param {boolean} isZoomPanSettingEnabled
     */
    constructor(canvasElement, cardDimension, canvasDimension, totalColumns, padding, isZoomPanSettingEnabled) {
        this.cardDimension = cardDimension
        this.canvasDimension = canvasDimension
        this.totalColumns = totalColumns
        this.padding = padding
        this.isPanning = false
        this.groupMemberList = []
        this.lastPosX = 500
        this.lastPosY = 500
        this.isZoomPanSettingEnabled = isZoomPanSettingEnabled
        this.canvasInstance = new fabric.Canvas(canvasElement, {
            fill: colors.CANVAS_FILL_COLOR,
            stroke: colors.THEME_COLOR,
            height: this.canvasDimension.height,
            width: this.canvasDimension.width,
            originX: 'center',
            originY: 'center'
        })

    }
    getInstance() {
        return this.canvasInstance
    }
    /**
     * @param {boolean} isZoomPanEnabled
     */
    setZoomPan(isZoomPanEnabled) {
        this.isZoomPanSettingEnabled = isZoomPanEnabled
    }
    clearInstance() {
        this.canvasInstance.clear()
    }
    /**
     * @param {any[]} allMembers
     * @param {any[]} allMembersImageData
     */
    renderAllMembers(allMembers, allMembersImageData) {
        allMembers.forEach((member, index) => {
            const memberImageData = allMembersImageData.find(data => data.user === member.id)
            this.createMember(member, index, memberImageData, allMembers)
        })
        this.mountBlurHandler()
        if (this.isZoomPanSettingEnabled) {
            this.mountZoomPanHandler()
        }
        this.canvasInstance.renderAll()
    }
    unmount() {
        this.unmountAnimation()
        this.unmountClickHandlers()
        this.unmountZoomPanHandler()
        this.unmountBlurHandler()
        this.clearInstance()
        this.canvasInstance.destroy()
    }
    /**
     * @param {fabric.BasicTransformEvent<fabric.TPointerEvent> & { target: fabric.FabricObject; }} options
     */
    selectedBlurHandler(options) {
        options.target.setCoords();
        this.canvasInstance.forEachObject(function(group) {
          if (group === options.target) return;
          group.set('opacity' , options.target.intersectsWithObject(group) ? 0.3 : 1);
        });
    }
    /**
     * @param {any} member
     * @param {number} index
     * @param {any} memberImageData
     * @param {any} allMembers
     */
    createMember(member, index, memberImageData, allMembers) {
        const column = index % this.totalColumns;
        const row = Math.floor(index / this.totalColumns);
        const xPlacement = column * (this.cardDimension.width + this.padding)
        const yPlacement =  row * (this.cardDimension.height + this.padding)
        const currentColorSet = colors.GRADIENT_SETS[index % 4]
        
        const mainCard = this._createFabricCard(
            currentColorSet,
            0,
            0,
            this.cardDimension.width,
            this.cardDimension.height,
            'transparent',
            currentColorSet[0],
            1,
            false,
            false,
            true,
            10,
            10,
            true
        )
        const memberNameSection = this._createFabricText(
            member.login,
            colors.BLACK,
            this.cardDimension.height * 0.35,
            this.cardDimension.width * 0.3,
            origin.LEFT,
            origin.CENTER,
            true,
            this.cardDimension.width * 0.07
        )
        const memberId = `Id - ${member.id.toString()}`
        const memberIdSection = this._createFabricText(
            memberId,
            colors.CANVAS_FILL_COLOR,
            this.cardDimension.height * 0.8,
            this.cardDimension.width * 0.3,
            origin.LEFT,
            origin.BOTTOM,
            true,
            this.cardDimension.width * 0.07
        )

        const memberGithubLink = this._createFabricText(
            '➜',
            colors.WHITE,
            this.cardDimension.height * 0.4,
            this.cardDimension.width * 0.85,
            origin.LEFT,
            origin.TOP,
            false,
            this.cardDimension.width * 0.1
        )

        this._createFabricGroupWithImage(
            [mainCard, memberNameSection, memberIdSection,  memberGithubLink],
            memberImageData.image,
            member,
            allMembers,
            this.cardDimension.width * 0.05,
            this.cardDimension.height * 0.15,
            xPlacement,
            yPlacement
        )
    }
    mountBlurHandler(){
        this.canvasInstance.on({
            'object:moving': (options) => this.selectedBlurHandler(options),
            'object:scaling': (options) => this.selectedBlurHandler(options),
            'object:rotating': (options) => this.selectedBlurHandler(options),
        });
    }
    unmountBlurHandler(){
        this.canvasInstance.off({
            'object:moving': (options) => this.selectedBlurHandler(options),
            'object:scaling': (options) => this.selectedBlurHandler(options),
            'object:rotating': (options) => this.selectedBlurHandler(options),
        });
    }
    mountAnimation(){
        const groups = this.groupMemberList.map(groupMember => groupMember.group)
        groups.forEach((group) =>{
            group.on('mouseover', () => {
                this.__startFireAnimation(group);
            });
            group.on('mouseout', () => {
                this.__stopFireAnimation(group);
            });
        });
    }
    unmountAnimation(){
        const groups = this.groupMemberList.map(groupMember => groupMember.group)
        groups.forEach((group) => {
            group.off('mouseover', () => {
                this.__startFireAnimation(group);
            });

            group.off('mouseout', () => {
                this.__stopFireAnimation(group);
             });
        });
    }

    mountClickHandlers(){
        this.groupMemberList.forEach(groupMember => {
            groupMember.group.on('mousedown', (event) => {
              const mouseEvent = event.e;
              if(mouseEvent.metaKey) {
                mouseEvent.preventDefault()
                window.open(groupMember.member.html_url, '_blank')
              }
            })
          })
    }
    unmountClickHandlers(){
        this.groupMemberList.forEach(groupMember => {
            groupMember.group.off('mousedown', (event) => {
              const mouseEvent = event.e;
              if(mouseEvent.metaKey) {
                mouseEvent.preventDefault()
                window.open(groupMember.member.html_url, '_blank')
              }
            })
        })
    }
    mountZoomPanHandler() {
        this.canvasInstance.on('mouse:down', (event) => {
            const evt = event.e;
            if (evt.altKey === true) {
                this.isPanning = true;
                this.canvasInstance.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            }
        });
    
        this.canvasInstance.on('mouse:move', (event) => {
            if (this.isPanning && this.isZoomPanSettingEnabled) {
                const e = event.e;
                const vpt = this.canvasInstance.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.canvasInstance.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
            }
        });
    
        this.canvasInstance.on('mouse:up', () => {
            this.isPanning = false;
            this.canvasInstance.selection = true;
        });
    
        this.canvasInstance.on('mouse:wheel', (event) => {
          if (this.isZoomPanSettingEnabled) {
            const delta = event.e.deltaY;
            let zoom = this.canvasInstance.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            this.canvasInstance.zoomToPoint({
                x: event.e.offsetX,
                y: event.e.offsetY 
            }, zoom);
            event.e.preventDefault();
            event.e.stopPropagation();
          }
    
        });
      }
    
    unmountZoomPanHandler() {
        this.canvasInstance.off('mouse:down', (event) => {
            const evt = event.e;
            if (evt.altKey === true) {  
                this.isPanning = true;
                this.canvasInstance.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            }
        });
    
        this.canvasInstance.off('mouse:move', (event) => {
            if (this.isPanning && this.isZoomPanSettingEnabled) {
                const e = event.e;
                const vpt = this.canvasInstance.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.canvasInstance.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
            }
        });
    
        this.canvasInstance.off('mouse:up', () => {
            this.isPanning = false;
            this.canvasInstance.selection = true;
        });
    
        this.canvasInstance.off('mouse:wheel', (event)=> {
          if (this.isZoomPanSettingEnabled) {
            const delta = event.e.deltaY;
            let zoom = this.canvasInstance.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            this.canvasInstance.zoomToPoint({
                x: event.e.offsetX,
                y: event.e.offsetY
            }, zoom);
            event.e.preventDefault();
            event.e.stopPropagation();
          }
    
        });
      }
    /**
     * @param {string[]} currentColorSet
     * @param {number} top
     * @param {number} left
     * @param {number} width
     * @param {number} height
     * @param {string} fill
     * @param {string} stroke
     * @param {number} strokeWidth
     * @param {boolean} hasControls
     * @param {boolean} hasBorders
     * @param {boolean} isSelectable
     * @param {number} rx
     * @param {number} ry
     * @param {boolean} shouldSetGradientFill
     */
    _createFabricCard(currentColorSet, top, left, width, height, fill, stroke, strokeWidth, hasControls, hasBorders, isSelectable, rx, ry, shouldSetGradientFill) {
        const card = new fabric.Rect({
            width,
            height,
            fill,
            stroke,
            strokeWidth,
            hasControls,
            hasBorders,
            selectable: isSelectable,
            rx,
            ry,
            top,
            left
        })
        
        if (shouldSetGradientFill) {
            card.set('fill', new fabric.Gradient({
                type: 'linear',
                gradientUnits: 'percentage',
                coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
                colorStops: [
                    { offset: 0, color: currentColorSet[0] },
                    { offset: 0.25, color: currentColorSet[1] },
                    { offset: 0.5, color: currentColorSet[2]},
                    { offset: 1, color: currentColorSet[3]},
                ]
            }))
        }
        return card
    }
    /**
     * @param {any} text
     * @param {string} fill
     * @param {number} top
     * @param {number} left
     * @param {string} originX
     * @param {string} originY
     * @param {boolean} isBold
     * @param {number} fontSize
     */
    _createFabricText(text, fill, top, left, originX = origin.LEFT, originY = origin.CENTER, isBold, fontSize) {
        const fabricText = new fabric.Text(text, {
            left,
            top,
            originX,
            originY,
            fill,
            fontSize,
            fontWeight: isBold ? 'bold': ''
          });
          return fabricText
    }
    /**
     * @param {(fabric.Rect<{ width: number; height: number; fill: string; stroke: string; strokeWidth: number; hasControls: boolean; hasBorders: boolean; selectable: boolean; rx: number; ry: number; top: number; left: number; }, fabric.SerializedRectProps, fabric.ObjectEvents> | fabric.FabricText<fabric.TOptions<fabric.TextProps>, fabric.SerializedTextProps, fabric.ObjectEvents>)[]} elements
     * @param {string} imageData
     * @param {{ id: any; }} member
     * @param {any} allMembers
     * @param {number} left
     * @param {number} top
     * @param {number} xPlacement
     * @param {number} yPlacement
     */
    _createFabricGroupWithImage(elements, imageData, member, allMembers, left, top, xPlacement, yPlacement) {
        fabric.Image.fromURL(imageData).then((image) => {
            const imageContainer = new fabric.Rect({
                width: image.width,
                height: image.height,
                originX: origin.CENTER,
                originY: origin.CENTER,
                rx: image.width,
                ry: image.height
            })
            image.set({
                left,
                top,
                scaleX: 0.15,
                scaleY: 0.15,
                selectable: false,
                clipPath: imageContainer,
                crossOrigin: 'anonymous'
            })
            const group = new fabric.Group([...elements, image], {
                left: (xPlacement === 0 ? 20:  xPlacement + 20) * 15,
                top: yPlacement === 0 ? 20 : yPlacement + 20,
                hoverCursor: 'pointer',
                selectable: true,
                hasBorders: false,
                hasControls: false,
                shadow: {
                  color: 'rgba(255, 69, 0, 0.5)',
                  blur: 10,
                  offsetX: 0,
                  offsetY: 0
                }
            })
            group.set('id', member.id)
            this.canvasInstance.add(group)

            group.on('mouseover', () => {
                group.set({
                    scaleX: 1.05,
                    scaleY: 1.05
                });
                this.canvasInstance?.renderAll()
            })
            group.on('mouseout', () => {
                group.set({
                    scaleX: 1,
                    scaleY: 1,
                });
                this.canvasInstance?.renderAll();
            })
            this.groupMemberList.push({group, member})
            if (this.groupMemberList.length === allMembers.length) {
                this.mountAnimation()
                this.mountClickHandlers()
            }
        }, {
            crossOrigin: 'anonymous'
        })
    }
    /**
     * @param {fabric.Group} group
     */
    __startFireAnimation(group) {
        let animationInterval;
    
        /**
         * @param {fabric.Canvas} canvas
         */
        function animate(canvas) {
          group.set('shadow', {
              color: `rgba(255, 69, 0, ${Math.random() * 0.6 + 0.4})`,
              blur: Math.random() * 100 + 10,
              offsetX: Math.random() * 20 - 10,
              offsetY: Math.random() * 20 - 10
          });
    
          canvas?.renderAll();
        }
        animationInterval = setInterval(() => animate(this.canvasInstance), 100);
        group.animationInterval = animationInterval;
      }
    /**
     * @param {fabric.Group} group
     */
    __stopFireAnimation(group) {
        clearInterval(group.animationInterval);
        group.set('shadow', {
            color: 'rgba(0,0,0,0)',
            blur: 0,
            offsetX: 0,
            offsetY: 0
        });

        this.canvasInstance.renderAll();
    }
    
}