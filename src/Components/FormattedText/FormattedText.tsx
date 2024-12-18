import { Link } from "react-router-dom";
import "./FormattedText.scss";

type FormattedTextProps = {
  children: string;
};

export default function FormattedText({ children }: FormattedTextProps) {
  /*
    examine each line separately and render it accordingly:
        if it starts with # it is a heading ✔
        if it starts with ## it is a smaller heading ✔
        // if it starts with - it is a list
        // if it starts with 1. it is a numbered list
        if it starts with !i it is an image, !i(url alt Width*Height) ✔
        if it starts with !v it is a video, !v(youtubeVideoId Width*Height) ✔

    If ANY line contains:
        *text* - text is bolded ✔
        /text/ - text is italicized ✔
        _text_ - text is underlined ✔
        [text](url) - text is a link ✔
        [text](@e exerciseId) - text is a mention to an exercise ✔
        [text](@w workoutId) - text is a mention to a workout ✔
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

      //Handle links
      if (text[i] === "[") {
        let closing = 0;

        //Find closing tag for text
        for (let j = i + 1; j < text.length; j++) {
          if (text[j] === "]") {
            closing = j;
            break;
          }
        }

        if (!closing || closing + 1 >= text.length || text[closing + 1] !== "(")
          continue;

        nodes.push(text.slice(t, i));

        if (text[closing + 2] === "@") {
          //Mention to an exercise or a workout
          closing += 3;
          i += 3;
          if (text[closing] === "e" || text[closing] === "w") {
            //Find closing tag for exercise or workout id
            for (let j = closing + 1; j < text.length; j++) {
              if (text[j] === ")") {
                nodes.push(
                  <Link
                    to={`/${
                      text[closing] === "e" ? "exercises" : "workouts"
                    }/${text.slice(closing + 2, j)}`} // + 2 because closing is index of 'e' or 'w' and after it is a space (' ')
                    key={`${i} ${j}`}
                  >{`${formatText(text.slice(i + 1, closing - 3))}`}</Link>
                );
                i = j + 1;
                t = j + 1;
                break;
              }
            }
          }
        } else {
          //URL
          //Find closing tag for url
          for (let j = closing + 1; j < text.length; j++) {
            if (text[j] === ")") {
              nodes.push(
                <a
                  href={text.slice(closing + 2, j)} // + 2 because closing is index of ']' and after it is '('
                  key={`${i} ${j}`}
                  target="_blank"
                >{`${formatText(text.slice(i + 1, closing))}`}</a>
              );
              i = j + 1;
              t = j + 1;
              break;
            }
          }
        }
      }

      //Handle images and videos
      if (
        text[i] === "!" &&
        (text[i + 1] === "i" || text[i + 1] === "v") &&
        text[i + 2] === "("
      ) {
        nodes.push(text.slice(t, i));
        for (let j = i + 3; j < text.length; j++) {
          if (text[j] === ")") {
            const split = text.slice(i + 3, j).split(" ");

            if (text[i + 1] === "i") {
              const alt = split[1] ?? "Image not found";
              const size = split[2] ? split[2].split("*") : [];

              nodes.push(
                <img
                  src={split[0]}
                  alt={alt}
                  key={`${i} ${j}`}
                  style={{
                    maxWidth: !size[0]
                      ? undefined
                      : isNaN(parseInt(size[0][size[0].length - 1]))
                      ? size[0]
                      : `${size[0]}px`,
                    maxHeight: !size[1]
                      ? undefined
                      : isNaN(parseInt(size[1][size[1].length - 1]))
                      ? size[1]
                      : `${size[1]}px`,
                  }}
                />
              );
            } else {
              const size = split[1] ? split[1].split("*") : [];

              nodes.push(
                <iframe
                  width={size[0] ?? 560}
                  height={size[1] ?? 315}
                  src={`https://www.youtube.com/embed/${split[0]}`}
                  title="YouTube video player"
                  allow="encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  key={`${i} ${j}`}
                ></iframe>
              );
            }

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
