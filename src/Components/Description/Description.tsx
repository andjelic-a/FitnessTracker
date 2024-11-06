import "./Description.scss";

type DescriptionProps = {
  placeholder?: string;
  text?: string;
};

export default function Description({ placeholder, text }: DescriptionProps) {
  return (
    <div className="description-container">
      <div className="description">
        <label className="description-placeholder">{placeholder}</label>
        {text}
      </div>
    </div>
  );
}
