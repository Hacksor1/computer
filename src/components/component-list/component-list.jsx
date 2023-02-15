import CardComponent from '../card-component/card-component'

function ComponentList({components = []}) {
  return (
    <div>
      {components.map((c) => (
        <CardComponent
          key={c.id}
          description={c.description}
          image={c.image}
          title={c.title}
          type={c.type}
          id={c.id}
        />
      ))}
    </div>
  )
}

export default ComponentList;