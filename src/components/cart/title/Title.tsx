interface Props{
    title: string;
    subtitle?: string;
}

export const Title = ({title, subtitle}:Props) => {
  return (
    <h1 className="font-bold text-2xl">{title}</h1>
  )
}
