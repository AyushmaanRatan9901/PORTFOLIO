export default function SectionTitle({ tag, title, desc }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <p className="text-sky-400 font-bold mb-3">{tag}</p>
      <h2 className="text-3xl sm:text-5xl font-black">{title}</h2>
      {desc && <p className="text-slate-400 mt-4">{desc}</p>}
    </div>
  );
}
