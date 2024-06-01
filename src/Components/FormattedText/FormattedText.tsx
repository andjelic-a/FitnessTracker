type FormattedTextProps = {
  children: string;
};

export default function FormattedText({ children }: FormattedTextProps) {
  //TODO:
  /*
    examine each line separately and render it accordingly:
        if it starts with # it is a heading
        if it starts with ## it is a smaller heading
        if it starts with * it is a list
        if it starts with - it is a list
        if it starts with 1. it is a numbered list
        if it starts with !i it is an image, !i Width*Height url
        if it starts with !v it is a video, !v Width*Height url

    If ANY line contains:
        #text# - text is bolded
        /text/ - text is italicized
        -text- - text is underlined
        [text](url) - text is a link
        @text@(exerciseId) - text is a mention to an exercise
  */
  return <div>{children}</div>;
}
