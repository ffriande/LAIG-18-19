/**
 * MyLeaf
 * @constructor
 */
class MyLeaf 
{
    constructor(graph,type,values)
    {
        this.graph = graph;
        this.type = type;
        this.values = values;

        switch (this.type)
        {
            case 'triangle':
                this.primitive = new MyTriangle(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3], this.values[4], this.values[5], this.values[6], this.values[7], this.values[8]);
                break;
            case 'rectangle':
                this.primitive = new MyRectangle(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3]);
                break;
            case 'sphere':
                this.primitive = new MySphere(this.graph.scene, this.values[0], this.values[1], this.values[2]);
                break;
            case 'cylinder':
                this.primitive = new MyCylinderWithBase(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3], this.values[4]);
                break;
            case 'cylinder_baseless':
                this.primitive = new MyCylinder(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3], this.values[4]);
                break;
            case 'torus':
                this.primitive = new MyTorus(this.graph.scene, this.values[0], this.values[1], this.graph.torus);
                break;
        }
    };
};