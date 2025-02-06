export default function CV({ cvData }) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My CV</h1>
        {cvData && cvData.map((section) => (
          <section key={section.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">{section.title.rendered}</h2>
            {/* Assuming content is HTML */}
            <div dangerouslySetInnerHTML={{ __html: section.content.rendered }} />
          </section>
        ))}
      </div>
    );
  }
  
  export async function getStaticProps() {
    // Replace with your WordPress API endpoint. Adjust the endpoint if necessary.
    const res = await fetch('https://stefoa.dreamhosters.com/wp-json/wp/v2/cv');
    const cvData = await res.json();
  
    return { props: { cvData }, revalidate: 60 }; // revalidate every 60 seconds
  }
  