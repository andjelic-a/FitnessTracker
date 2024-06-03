import "./FormattedText.scss";

type FormattedTextProps = {
  children: string;
};

export default function FormattedText({ children }: FormattedTextProps) {
  //TODO:
  /*
    examine each line separately and render it accordingly:
        if it starts with # it is a heading ✔
        if it starts with ## it is a smaller heading ✔
        if it starts with - it is a list ???
        if it starts with 1. it is a numbered list
        if it starts with !i it is an image, !i Width*Height url
        if it starts with !v it is a video, !v Width*Height url

    If ANY line contains:
        *text* - text is bolded ✔
        /text/ - text is italicized ✔
        _text_ - text is underlined ✔
        [text](url) - text is a link
        [text](@e exerciseId) - text is a mention to an exercise
        [text](@w workoutId) - text is a mention to a workout
  */
  return (
    <div>
      {children.split("\n").map((line, i) => (
        <FormattedLine key={i}>{line}</FormattedLine>
      ))}
    </div>
  );
}

function FormattedLine({ children }: { children: string }) {
  if (children.startsWith("##"))
    return <h2>{formatText(children.slice(2))}</h2>;

  if (children.startsWith("#")) return <h1>{formatText(children.slice(1))}</h1>;

  return <p>{formatText(children)}</p>;

  function formatText(text: string): (string | React.ReactNode)[] {
    const nodes: (string | React.ReactNode)[] = [];
    let t = 0;

    for (let i = 0; i < text.length; i++) {
      //Handle bold text
      if (text[i] === "*") {
        nodes.push(text.slice(t, i));
        //Find closing tag
        for (let j = i + 1; j < text.length; j++) {
          if (text[j] === "*") {
            nodes.push(
              <b key={`${i} ${j}`}>{formatText(text.slice(i + 1, j))}</b>
            );
            i = j + 1;
            t = j + 1;
            break;
          }
        }
      }

      //Handle italic text
      if (text[i] === "/") {
        nodes.push(text.slice(t, i));
        //Find closing tag
        for (let j = i + 1; j < text.length; j++) {
          if (text[j] === "/") {
            nodes.push(
              <i key={`${i} ${j}`}>{formatText(text.slice(i + 1, j))}</i>
            );
            i = j + 1;
            t = j + 1;
            break;
          }
        }
      }

      //Handle underlined text
      if (text[i] === "_") {
        nodes.push(text.slice(t, i));
        //Find closing tag
        for (let j = i + 1; j < text.length; j++) {
          if (text[j] === "_") {
            nodes.push(
              <u key={`${i} ${j}`}>{formatText(text.slice(i + 1, j))}</u>
            );
            i = j + 1;
            t = j + 1;
            break;
          }
        }
      }
    }

    nodes.push(text.slice(t, text.length));
    return nodes;
  }
}
