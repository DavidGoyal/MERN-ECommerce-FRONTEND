const Loader = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  )
}

export default Loader


export const Skeleton=({width="unset",count=3}:{width?:string,count?:number})=>{
  const skeletons=Array.from({length:count}).map((_,i)=><div key={i} className="skeleton-shape"></div>)
  return(
    <div className="skeleton-loader" style={{width}}>
      {skeletons}
    </div>
  )
}