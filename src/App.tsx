import { useEffect, useState } from "react";
import { TypeEffect } from "./components/TypeEffect";
import { BsMouse } from "react-icons/bs";

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  created_at: string;
  homepage: string;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6; // Número de projetos exibidos por página

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/users/jonasnetopng/repos"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      setProjects(data);
    } catch (error) {
      console.error("Erro ao buscar os projetos:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("https://api.github.com/users/jonasnetopng");
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      if (typeof data !== 'object') {
        throw new Error("Data is not an object");
      }

      setUser(data);
    } catch (error) {
      console.error("Erro ao buscar as informações do usuário:", error);
    }
  };

  // Lógica de paginação
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleScroll = () => {
    const element = document.getElementById("projects-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-indigo-900 to-indigo-500 flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <img
            src="https://github.com/jonasnetopng.png"
            alt="Logo"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
        <h1 className="font-roboto font-bold text-center text-white text-3xl">
          <TypeEffect
            text={["Jonas Nogueira Neto", "Front-end developer"]}
            speed={100}
          />
        </h1>
        <BsMouse
          className="animate-bounce text-white text-3xl cursor-pointer"
          onClick={handleScroll}
        />
      </div>

      <section id="projects-section" className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 space-y-8">
          <h2 className="text-3xl font-bold text-center">Sobre</h2>
          {user && (
            <p className="text-center text-gray-700 text-lg">
              {user.name} - {user.bio}
            </p>
          )}

          <h2 className="text-3xl font-bold text-center">Meus Projetos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentProjects.map((project: Project) => (
              <div
                key={project.id}
                className="bg-white m-2 rounded-md p-4 shadow-md hover:shadow-lg transition-shadow ease-in-out duration-200"
              >
                <h3 className="text-lg font-semibold mb-2">{project.name || "Unnamed project"}</h3>
                <p className="text-gray-600">{project.description || "No description available"}</p>
                <p className="text-gray-600">
                  Criado em: {
                    new Date(project.created_at).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                </p>
                <div className="flex flex-col space-y-4 mt-4">
                  {project.html_url && (
                    <a href={project.html_url} className="text-indigo-600 hover:underline">
                      Ver no GitHub
                    </a>
                  )}
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Ver no GitHub Pages
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            {projects.length > projectsPerPage && (
              <div className="flex space-x-2">
                {Array.from(
                  { length: Math.ceil(projects.length / projectsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-2 py-1 rounded ${
                        i + 1 === currentPage ? "bg-indigo-600 text-white" : "bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
