// pages/cv.js
export default function CV({ cvData }) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      {cvData.map((cv) => (
        <section key={cv.id} className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{cv.title.rendered}</h1>

          <h2 className="text-xl font-semibold">Professional Summary</h2>
          <div dangerouslySetInnerHTML={{ __html: cv.acf.professional_summary }} />

          <h2 className="text-xl font-semibold mt-4">Technical Skills</h2>
          <div dangerouslySetInnerHTML={{ __html: cv.acf.technical_skills }} />

          <h2 className="text-xl font-semibold mt-4">Business &amp; Personal Skills</h2>
          <div dangerouslySetInnerHTML={{ __html: cv.acf.business_personal_skills }} />

          <h2 className="text-xl font-semibold mt-4">Work Experience</h2>
          {cv.acf.related_work_experience &&
            cv.acf.related_work_experience.map((exp, i) => (
              <div key={i} className="mb-2">
                <strong>{exp.acf.job_title}</strong> at {exp.acf.company_name} ({exp.acf.duration})
                <div dangerouslySetInnerHTML={{ __html: exp.acf.job_description }} />
              </div>
            ))}

          <h2 className="text-xl font-semibold mt-4">Education</h2>
          {cv.acf.related_education &&
            cv.acf.related_education.map((edu, i) => (
              <div key={i} className="mb-2">
                <strong>{edu.title.rendered}</strong> – {edu.acf.qualification} from {edu.acf.institution} ({edu.acf.year})
                {edu.acf.description && edu.acf.description.trim() !== "" && (
                  <div dangerouslySetInnerHTML={{ __html: edu.acf.description }} />
                )}
              </div>
            ))}

          <h2 className="text-xl font-semibold mt-4">Certifications</h2>
          {cv.acf.related_certifications &&
            cv.acf.related_certifications.map((cert, i) => {
              // Check if the certification post has nonempty ACF data
              const hasCertACF =
                cert.acf &&
                typeof cert.acf === "object" &&
                Object.keys(cert.acf).length > 0;
              return (
                <div key={i} className="mb-2">
                  {hasCertACF ? (
                    <>
                      <strong>{cert.acf.certification_title}</strong> by{" "}
                      {cert.acf.issuing_organization} (
                      {cert.acf.year})
                      {cert.acf.certificate_link &&
                        cert.acf.certificate_link.trim() !== "" && (
                          <a
                            href={cert.acf.certificate_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            View Certificate
                          </a>
                        )}
                    </>
                  ) : (
                    // Fallback: use the post title if no ACF data is present.
                    <strong>{cert.title.rendered}</strong>
                  )}
                </div>
              );
            })}

          <h2 className="text-xl font-semibold mt-4">Hobbies &amp; Interests</h2>
          <div dangerouslySetInnerHTML={{ __html: cv.acf.hobbies_interests }} />

          <h2 className="text-xl font-semibold mt-4">References</h2>
          <div dangerouslySetInnerHTML={{ __html: cv.acf.references }} />
        </section>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  try {
    // Fetch the main CV post(s)
    const res = await fetch('https://stefoa.dreamhosters.com/wp-json/wp/v2/cv');
    let cvData = await res.json();
    if (!Array.isArray(cvData)) {
      cvData = [cvData];
    }

    // Helper: Given an array of IDs and a post type slug, fetch full objects.
    async function fetchRelatedPosts(ids, endpoint) {
      return await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`https://stefoa.dreamhosters.com/wp-json/wp/v2/${endpoint}/${id}`);
            if (!res.ok) {
              console.warn(`Failed to fetch ${endpoint} post with id ${id}. Status: ${res.status}`);
              return null;
            }
            return await res.json();
          } catch (e) {
            console.warn(`Error fetching ${endpoint} post with id ${id}: ${e}`);
            return null;
          }
        })
      );
    }

    // For each CV post, fetch the related posts.
    await Promise.all(
      cvData.map(async (cv) => {
        if (cv.acf.related_work_experience && Array.isArray(cv.acf.related_work_experience)) {
          const workExperience = await fetchRelatedPosts(cv.acf.related_work_experience, 'work-experience');
          cv.acf.related_work_experience = workExperience.filter((item) => item !== null);
        }
        if (cv.acf.related_education && Array.isArray(cv.acf.related_education)) {
          const education = await fetchRelatedPosts(cv.acf.related_education, 'education');
          cv.acf.related_education = education.filter((item) => item !== null);
        }
        if (cv.acf.related_certifications && Array.isArray(cv.acf.related_certifications)) {
          const certifications = await fetchRelatedPosts(cv.acf.related_certifications, 'certification');
          cv.acf.related_certifications = certifications.filter((item) => item !== null);
        }
      })
    );

    return { props: { cvData }, revalidate: 60 };
  } catch (error) {
    console.error('Error fetching CV data:', error);
    return { props: { cvData: [] } };
  }
}
