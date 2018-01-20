import React, { Component } from 'react';
import paper from 'paper';
import { Glyph } from './';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3';

class FontOutlineViewer extends Component {
  constructor(props){
    super(props);

    this.glyphs = [];
  }

  componentDidMount(){
    this.paperScope = new paper.PaperScope();
    this.paperScope.setup(this.refCanvas);

    var { font } = this.props;
    var fontGlyphs = font.stringToGlyphs(this.props.message);
    var kerning = true;
    var kerningValue = 0;

    var fontSize = 300;
    var x = 160;
    var fontScale = 1 / font.unitsPerEm * fontSize;

    _.each(fontGlyphs, (glyphData, i) => {
      // debugger;
      let glyph = new Glyph({
        glyph: glyphData,
        x: x,
        fontSize: fontSize,
        unitsPerEm: font.unitsPerEm
      });
      this.glyphs.push(glyph);
      glyph.init();


      if (glyphData.advanceWidth) {
        x += glyphData.advanceWidth * fontScale;
      }
      if (i < fontGlyphs.length - 1) {
        kerningValue = font.getKerningValue(glyphData, fontGlyphs[i + 1]);
        x += kerningValue * fontScale;
      }

    });

    this.paperScope.view.draw();
  }

  componentWillReceiveProps(newProps){

    // paper.view.update();
  }

  componentDidUpdate(){

    let { screenWidth } = this.props;
    let leftWidthScale = scaleLinear().domain([480, 1440]).clamp(true).range([65, 230]);

    this.paperScope.view.viewSize = new paper.Size( screenWidth - (leftWidthScale(screenWidth) + 24 * 2), 400 );

  }

  render() {
    let { screenWidth } = this.props;
    let leftWidthScale = scaleLinear().domain([480, 1440]).clamp(true).range([65, 230]);

    let width = screenWidth - (leftWidthScale(screenWidth) + 24 * 2);

    return (
      <canvas ref={ ref => { this.refCanvas = ref;} } width={width * 2} height="400" style={{ width: width, height: 400}}>
      </canvas>
    );
  }
}


let mapStateToProps = state => {
  return {
    screenWidth: state.screenWidth
  }
}

export default connect(mapStateToProps)(FontOutlineViewer);