interface AudioProps {
  url: string;
  type?: string;
}

export default ({ url, type }: AudioProps) => {
  return (
    <audio src={url} preload="true" controls>
      <source src={url} type={type} />
    </audio>
  );
};
