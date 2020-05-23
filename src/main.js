/**
 * @module main
 * @desc The main plugin module
 */

const { SceneNode } = require('scenegraph');
const dialogHelper = require('xd-dialog-helper');

/**
 * The sample command.
 * @param {XDSelection} selection
 * @param {import('scenegraph').RootNode} root
 */
async function myCommand(selection, root) {
    console.log('My Plugin');

    const results = await dialogHelper.showDialog('constraint-options', 'Adjust Constraints', [
        {
            type: dialogHelper.types.TEXT,
            label: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam.`,
            id: 'labelDescription',
            htmlAttributes: {}
        },
        {
            type: dialogHelper.types.SLIDER,
            id: 'marginLeft',
            label: 'Margin Left',
            value: 20,
            required: true,
            unit: 'px',
            htmlAttributes: {
                min: 0,
                max: 100,
                step: 1
            }
        },
        {
            type: dialogHelper.types.SLIDER,
            id: 'marginRight',
            label: 'Margin Right',
            value: 20,
            required: true,
            unit: 'px',
            htmlAttributes: {
                min: 0,
                max: 100,
                step: 1
            }
        },

    ], {
        okButtonText: 'Apply',
        width: 480,
    });

    console.log(results);

    results.marginLeft = Math.round(results.marginLeft)
    results.marginRight = Math.round(results.marginRight)

    for (const node of selection.items) {
        if (node.parent) {
            node.horizontalConstraints = {
                position: SceneNode.FIXED_BOTH,
                size: SceneNode.SIZE_RESIZES
            };

            const nodeLeftCoordinate = node.globalBounds.x;
            const nodeRightCoordinate = node.globalBounds.x + node.globalBounds.width;


            const parentWidth = node.parent.localBounds.width;
            const newWidth = parentWidth - (results.marginLeft + results.marginRight);
            const newPostion = {
                x: node.parent.localBounds.x + results.marginLeft,
                y: node.boundsInParent.y
            }

            console.log(parentWidth, newWidth, parentWidth - newWidth);

            // console.log(node.localBounds, node.localCenterPoint, node.topLeftInParent);
            node.resize(newWidth, node.localBounds.height);
            node.placeInParentCoordinates({
                ...node.localBounds
            }, newPostion);

            // Place this node's top-left corner at the centerpoint of its parent
            // let parentCenter = node.parent.localBounds;  // parent's center in parent's coordinates
            // let nodeBounds = node.localBounds;  // node's bounds in its own local coordinates
            // let nodeTopLeft = { x: nodeBounds.x, y: nodeBounds.y };  // node's top left corner in its own local coordinates
            // node.placeInParentCoordinates(nodeTopLeft, parentCenter);
        }
    }
}

module.exports.commands = {
    myCommand
};
