import { IsometricCanvas, IsometricPath } from '../src';

describe('Snapshot tests', (): void => {

    let container: HTMLDivElement;

    beforeEach((): void => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }        
    });

    it('Draw methods', (): void => {

        const cube = new IsometricCanvas(container, {
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const top = new IsometricPath();
        const right = new IsometricPath();
        const left = new IsometricPath();

        top.moveTo(0, 0, 1).lineTo(1, 0, 1).lineTo(1, 1, 1).lineTo(0, 1, 1);
        right.moveTo(1, 0, 1).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(1, 1, 1);
        left.moveTo(1, 1, 1).lineTo(1, 1, 0).lineTo(0, 1, 0).lineTo(0, 1, 1);
        cube.addChild(top).addChild(right).addChild(left);

        expect(container).toMatchSnapshot();

    });

    it('Draw methods aliases', (): void => {

        const isometric = new IsometricCanvas(container, {
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const bottomT = new IsometricPath();
        const bottomR = new IsometricPath();
        const bottomL = new IsometricPath();
        
        const topT = new IsometricPath();
        const topR = new IsometricPath();
        const topL = new IsometricPath();

        bottomT.mt(0, 0, .5).lt(1, 0, .5).lt(1, 1, .5).lt(0, 1, .5);
        bottomR.mt(1, 0, .5).lt(1, 0, 0).lt(1, 1, 0).lt(1, 1, .5);
        bottomL.mt(1, 1, .5).lt(1, 1, 0).lt(0, 1, 0).lt(0, 1, .5);

        topT.mt(.25, .25, 1.25).lt(.75, .25, 1.25).lt(.75, .75, 1).lt(.25, .75, 1);
        topR.mt(.75, .25, 1.25).lt(.75, .75, 1).lt(.75, .75, .5).lt(.75, .25, .5);
        topL.mt(.75, .75, 1).lt(.25, .75, 1).lt(.25, .75, .5).lt(.75, .75, .5);

        isometric.addChildren(bottomT, bottomR, bottomL, topT, topR, topL);

        expect(container).toMatchSnapshot();

    });

    it('Draw commands', (): void => {

        const isometric = new IsometricCanvas(container, {
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const right = new IsometricPath();
        const top1 = new IsometricPath();
        const top2 = new IsometricPath();
        const top3 = new IsometricPath();
        const top4 = new IsometricPath();
        const left1 = new IsometricPath();
        const left2 = new IsometricPath();
        
        right.draw('M1 0 0 L1 1 0 L1 1 0.25 L1 0.5 0.25 L1 0.5 1 L1 0 1');
        top1.draw('M0.25 0.5 1 C0.5 0.5 0.75 0.75 0.5 1 L0.75 0 1 C0.5 0 0.75 0.25 0 1 L0.25 0.5 1');
        top2.draw('M1 0 1 L0.75 0 1 L0.75 0.5 1 L1 0.5 1 L1 0 1 M0 0 1 L0.25 0 1 L0.25 0.5 1 L0 0.5 1 L0 0 1');
        top3.draw('M0 0.5 0.5 L0.5 0.5 0.5 L0.5 1 0.5 L0 1 0.5');
        top4.draw('M0.5 0.5 0.5 L1 0.5 0.25 L1 1 0.25 L0.5 1 0.5');
        left1.draw('M0 0.5 1 L0 0.5 0.5 L0.5 0.5 0.5 L1 0.5 0.25 L1 0.5 1 L0.75 0.5 1 C0.5 0.5 0.75 0.25 0.5 1 L0 0.5 1');
        left2.draw('M0 1 0.5 L0.5 1 0.5 L1 1 0.25 L1 1 0 L0 1 0');

        isometric.addChildren(right, top1, top2, top3, top4, left1, left2);

        expect(container).toMatchSnapshot();

    });

    it('Draw curves', (): void => {

        const cube = new IsometricCanvas(container, {
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });
    
        const under = new IsometricPath({ fillColor: '#EEE' });
        const top = new IsometricPath();
        const right = new IsometricPath();
        const left = new IsometricPath();
    
        under
            .mt(0, 0, 1)
            .mt(0.25, 0, 1).ct(0.5, 0, 0.75, 0.75, 0, 1).lt(1, 0, 1)
            .lt(1, 0, 0.75).ct(0.75, 0, 0.5, 1, 0, 0.25).lt(1, 0, 0)
            .lt(1, 0.25, 0).ct(0.75, 0.5, 0, 1, 0.75, 0).lt(1, 1, 0)
            .lt(0.75, 1, 0).ct(0.5, 0.75, 0, 0.25, 1, 0).lt(0, 1, 0)
            .lt(0, 1, 0.25).ct(0, 0.75, 0.5, 0, 1, 0.75).lt(0, 1, 1)
            .lt(0, 0.75, 1).ct(0, 0.5, 0.75, 0, 0.25, 1).lt(0, 0, 1);
    
        top
            .mt(0, 0, 1)
            .lt(0.25, 0, 1).ct(0.5, 0.25, 1, 0.75, 0, 1).lt(1, 0, 1)
            .lt(1, 0.25, 1).ct(0.75, 0.5, 1, 1, 0.75, 1).lt(1, 1, 1)        
            .lt(0.75, 1, 1).ct(0.5, 0.75, 1, 0.25, 1, 1).lt(0, 1, 1)
            .lt(0, 0.75, 1).ct(0.25, 0.5, 1, 0, 0.25, 1).lt(0, 0, 1);
    
        right
            .mt(1, 0, 1)
            .lt(1, 0, 0.75).ct(1, 0.25, 0.5, 1, 0, 0.25).lt(1, 0, 0)
            .lt(1, 0.25, 0).ct(1, 0.5, 0.25, 1, 0.75, 0).lt(1, 1, 0)
            .lt(1, 1, 0.25).ct(1, 0.75, 0.5, 1, 1, 0.75).lt(1, 1, 1)
            .lt(1, 0.75, 1).ct(1, 0.5, 0.75, 1, 0.25, 1).lt(1, 0, 1);
    
        left
            .mt(1, 1, 1)
            .lt(1, 1, 0.75).ct(0.75, 1, 0.5, 1, 1, 0.25).lt(1, 1, 0)
            .lt(0.75, 1, 0).ct(0.5, 1, 0.25, 0.25, 1, 0).lt(0, 1, 0)
            .lt(0, 1, 0.25).ct(0.25, 1, 0.5, 0, 1, 0.75).lt(0, 1, 1)
            .lt(0.25, 1, 1).ct(0.5, 1, 0.75, 0.75, 1, 1).lt(1, 1, 1);
    
        cube.addChildren(under, top, right, left);

        expect(container).toMatchSnapshot();

    });



});