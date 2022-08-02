import { useState } from "react";
import CSSJSON from "cssjson";
import { jsonFromHTML } from "jsonfromhtml";
import { v4 as uuid } from "uuid";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [json, setJson] = useState("");
  const [cssValue, setCssValue] = useState("");
  const [cssJson, setCssJson] = useState("");

  const [keyValue, setKeyValue] = useState();
  const [objectKey, setObjectKey] = useState();
  const [objectValue, setObjectValue] = useState();
  const [attributes, setAttributes] = useState("");
  const [child, setChild] = useState("");
  const nodes = [];
  const style = [];
  const array = [];

  const handleCovert = () => {
    var cssjson = CSSJSON.toJSON(cssValue);
    setKeyValue(Object.entries(cssjson));
    var doc = new DOMParser().parseFromString(value, "text/xml");
    const jsonBody = jsonFromHTML(doc.firstElementChild);
    if (jsonBody && Object.keys(jsonBody).length) {
      convertToHtmlNode(jsonBody);
    }
    if (cssjson && Object.keys(cssjson?.children).length) {
      // onClicHandler();
      convertToCssNode(cssjson);
    }

    const payload = {
      payload: {
        nodes: nodes,
        styles: style,
        assets: {},
      },
    };
    // console.log(JSON.stringify(cssjson));
    setJson(JSON.stringify(payload));
  };

  // const onClicHandler = (index) => {
  //   const styleless = "";
  //   for (let i = 0; i < keyValue.length; i++) {
  //     for (let j = 0; j < keyValue[index? index : i].length; j++) {
  //       const index = ++i;
  //       // const val = [keyValue[i][j]];
  //       console.log(keyValue, index, j);
  //       onClicHandler(index)
  //       // if (val) {
  //       //   val.forEach((e) => {
  //       //     setObjectKey(Object.keys(e));
  //       //     setObjectValue(Object.values(e));
  //       //   });
  //       // }
  //     }
  //   }
  // };

  const convertToHtmlNode = (jsonBody) => {
    const classes = [];
    const children = [];
    const classesInAttrs = jsonBody?.attrs?.class?.split(" ");
    if (classesInAttrs?.length) {
      classesInAttrs.map((c) => {
        return classes.push(uuid());
      });
    }

    if (jsonBody?.children?.length) {
      jsonBody?.children?.map((c) => {
        if (c.nodeName) {
          children.push(uuid());
        }
      });
    }

    nodes.push({
      _id: uuid(),
      tag: jsonBody?.nodeName?.toString(),
      classes,
      children,
      data: {
        tag: jsonBody?.nodeName?.toString(),
        attr: jsonBody?.attrs,
      },
    });

    if (jsonBody.children) {
      jsonBody.children.map((c) => {
        if (c.nodeName) convertToHtmlNode(c);
      });
    }
    const HtmlToJson = JSON.stringify(nodes);
    // setJson(HtmlToJson);
  };

  const convertToCssNode = (cssjson) => {
    const children = [];

    if (cssjson && Object.keys(cssjson).length) {
      const keys = cssjson && Object.keys(cssjson?.children);
      if (array.length > 0) {console.log(array)
        for (let index = 0; index < array.length; index++) {
          children.push({
            _id: uuid(),
          });
        }
      }

      const k = Object.keys(cssjson?.attributes);
      const v = Object.values(cssjson?.attributes);

      const styleLess = [];
      let styleLessString = "";
      k?.map((x, i) => {
        styleLess.push(`${x}:${v[i]}`);
      });

      styleLessString = styleLess.join(";");
      // console.log(k, v);

      for (let i = 0; i < keys.length; i++) {
        style.push({
          fake: false,
          _id: uuid(),
          type: keys[i]?.includes(".")
            ? "class"
            : keys[i]?.includes("#")
            ? "id"
            : "element",
          name: keys[i].split(".")[1] || keys[i]?.split("#")[1] || keys[i],
          styleLess: styleLessString,
          children,
          comb: "",
          namespace: "",
          selector: null,
        });
      }

      if (cssjson?.children && Object.keys(cssjson?.children).length) {
        const values = Object.values(cssjson?.children);
        values?.map((c) => {
          if (Object.keys(c).length) {
            array.push(c);
            convertToCssNode(c);
          }
        });
      }
      setCssJson(JSON.stringify(style));
      // console.log("cssSpecificJson", keys);
    }
  };

  return (
    <div className="App">
      <h1>Convert HTML & CSS into JSON</h1>
      <div className="container">
        <div className="html-converter">
          <h3>Html Convertion</h3>
          <textarea onChange={(e) => setValue(e.target.value)} />
          <div>
            <h2>Result</h2>
          </div>
          <textarea value={json} />
        </div>

        <div className="css-converter">
          <h3>CSS Convertion</h3>
          <textarea onChange={(e) => setCssValue(e.target.value)} />
          <div>
            <h2>Result</h2>
          </div>
          <textarea value={cssJson} />
        </div>
      </div>
      <button onClick={handleCovert}>Convert HTML & Css</button>
    </div>
  );
}

export default App;
