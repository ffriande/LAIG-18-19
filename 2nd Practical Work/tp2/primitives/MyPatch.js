class MyPatch {
    constructor(graph, xmlelem, degree1, degree2, controlVertexes) {

        var knots1 = this.getKnotsVector(degree1);
        var knots2 = this.getKnotsVector(degree2);

        var controlPointsList = [];
        for (var i = 0; i <= degree1; i++) {
            var tmp = [];
            for (var j = 0; j <= degree2; j++)
                tmp.push(controlVertexes.shift());
            controlPointsList.push(tmp);
        }

        var nurbsSurface = new CGFnurbsSurface(degree1,degree2,knots1,knots2,controlPointsList);

        this.primitive = new CGFnurbsObject(graph.scene,getSurfacePoint,20,20);

    }

    display() {
        this.primitive.display();

    }

    getKnotsVector(degree) {
        var v = new Array();
        for (var i = 0; i <= degree; i++) {
            v.push(0);
        }

        for (var i = 0; i <= degree; i++) {
            v.push(1);
        }
        return v;
    }

    getSurfacePoint(u, v) {
        return nurbsSurface.getPoint(u, v);
    }
    ;
}
