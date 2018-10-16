/**
 * MyLeaf
 * @constructor
 */
class MyLeaf 
{
    constructor(graph,element)
    {
        this.graph = graph;
        this.type = element[0];
        this.values = element[1];

        switch (this.type)
        {
            case 'triangle':
                this.primitive = new MyTriangle(this.graph.scene, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8]);
                break;
            case 'rectangle':
                this.primitive = new MyRectangle(this.graph.scene, values[0], values[1], values[2], values[3]);
                break;
            case 'sphere':
                //this.primitive = new MySphere(this.graph.scene, values[0], values[1], values[2]);
                break;
            case 'cylinder':
                //this.primitive = new MyCylinder(this.graph.scene, values[0], values[1], values[2], values[3], values[4]);
                break;
            case 'torus':
                //this.primitive = new MyTorus(this.graph.scene, values[0], values[1], this.graph.torus);
                break;
        }
    };
};