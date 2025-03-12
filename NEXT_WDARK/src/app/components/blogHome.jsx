export default function BlogHome() {
    return(
        <div className="principal-blog">
        <div className="principal-blog-header">
          <div className="principal-blog-header-items">
            <div className="principal-blog-header-title">
              <h1 className="principal-blog-title">Blog</h1>
              <h2 className="principal-blog-subtitle">Nuestro conocimiento en tus manos</h2>
            </div>
            <div className="principal-blog-breadcrumb"></div>
          </div>
        </div>
        <div className="principal-blog-labels-and-articles">
          <div className="principal-blog-labels">
            <div className="principal-blog-labels-categories">
              <h1 className="principal-blog-labels-categories-title">Categorias</h1>
              <div className="principal-blog-labels-categories-items">
                <div className="principal-blog-label-categories-item">
                  <a className="principal-blog-label-categories-link">Creatividad</a><span className="principal-blog-label-categories-quantity">-1</span>
                </div>
                <div className="principal-blog-label-categories-item">
                <a className="principal-blog-label-categories-link">Drupal</a><span className="principal-blog-label-categories-quantity">-1</span>
                </div>
                <div className="principal-blog-label-categories-item">
                <a className="principal-blog-label-categories-link">Github</a><span className="principal-blog-label-categories-quantity">-1</span>
                </div>
                <div className="principal-blog-label-categories-item-all">
                <a className="principal-blog-label-categories-link">Todas las categorias</a>
                </div>
              </div>
            </div>
            <div className="principal-blog-labels-tag">
              <h1 className="principal-blog-labels-tag-title">Etiquetas</h1>
              <div className="principal-blog-labels-tag-items">
                <div className="principal-blog-label-tag-item">
                  <a className="principal-blog-label-tag-link">Aprendizaje</a>
                </div>
                <div className="principal-blog-label-tag-item">
                <a className="principal-blog-label-tag-link">Bloqueos creativos</a>
                </div>
                <div className="principal-blog-label-tag-item">
                <a className="principal-blog-label-tag-link">Comandos</a>
                </div>
                <div className="principal-blog-label-tag-item">
                <a className="principal-blog-label-tag-link">Consejos</a>
                </div>
                <div className="principal-blog-label-tag-item">
                <a className="principal-blog-label-tag-link">Drupal</a>
                </div>
              </div>
            </div>
          </div>
          <div className="principal-blog-articles">
            <div className="principal-blog-article">
              <div className="principal-blog-article-title">Horror vacui</div>
              <div className="principal-blog-article-image"><img/>
              <div className="principal-blog-article-date"><p>25 de feb, 2020</p></div>
              </div>
              <div className="principal-blog-article-label"><p>Creatividad</p></div>
              <div className="principal-blog-article-description"><p>Crear es la acción a través de la cual el ser humano comprende su esencia divina; sin embargo, la creatividad demanda de algunos cuidados y ejercicios para evadir la indigestión mental que acaba en la nada.</p></div>
              <div className="principal-blog-article-see-more"><a>Ver mas</a></div>
            </div>
          </div>
          <div className="principal-blog-articles">
            <div className="principal-blog-article">
              <div className="principal-blog-article-title">Comandos utiles github</div>
              <div className="principal-blog-article-image"><img/>
              <div className="principal-blog-article-date"><p>25 de feb, 2020</p></div>
              </div>
              <div className="principal-blog-article-label"><p>Git hub</p></div>
              <div className="principal-blog-article-description"><p>En nuestro diario vivir como desarrolladores necesitamos la ayuda de GIT, este es un listado de comando que pueden ser de gran ayuda</p></div>
              <div className="principal-blog-article-see-more"><a>Ver mas</a></div>
            </div>
          </div>
        </div>
        </div>
    )
}