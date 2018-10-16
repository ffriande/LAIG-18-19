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
                this.primitive = new MyTriangle(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3], this.values[4], this.values[5], this.values[6], this.values[7], this.values[8]);
                break;
            case 'square':
                this.primitive = new MyRectangle(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3]);
                break;
            case 'square_at_zero':
                this.primitive = new MyRectangle(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3]);
                break;
            case 'sphere':
                //this.primitive = new MySphere(this.graph.scene, this.values[0], this.values[1], this.values[2]);
                break;
            case 'cylinder':
                this.primitive = new MyCylinder(this.graph.scene, this.values[0], this.values[1], this.values[2], this.values[3], this.values[4]);
                break;
            case 'torus':
                //this.primitive = new MyTorus(this.graph.scene, this.values[0], this.values[1], this.graph.torus);
                break;
        }
    };
};