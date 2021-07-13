import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/alurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(propriedade) {
  return (
    <Box as="aside">
        <img src={`https:/github.com/${propriedade.githubUser}.png`} style={{borderRadius: '8px' }} />
        <hr/>

        <a className="boxLink" href={`https://github.com/${propriedade.githubUser}`}> 
          @{propriedade.githubUser}
        </a>
        <hr/>
        <AlurakutProfileSidebarMenuDefault/>
        
    </Box>
  )
}


export default function Home() {
  const [comunidades, setComunidades] = React.useState([{
    id: '23123231321',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  // const comunidades = ['Tibianos'];

  const usuarioAleatorio = 'victorbohrer';

  const pessoasFavoritas = ['marcobrunodev', 'danielhe4rt', 'peas', 'juunegreiros', 'juunegreiros', 'juunegreiros']
  
  return (
  <>
    <AlurakutMenu />
    <MainGrid> 
      <div className="profileArea" style={{gridArea: 'profileArea'}}> 
        <ProfileSidebar githubUser={usuarioAleatorio}/>
      </div>

      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}> 
        <Box>
          <h1 className="title">
            Bem-vindo(a)
          </h1>

          <OrkutNostalgicIconSet/>
        </Box>

        <Box>
          <h2 className="subTitle">
            O que você deseja fazer?
          </h2>

          <form onSubmit={function handleCreateCommunity(e){
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            console.log('Campo: ', dadosDoForm.get('title'));
            console.log('Campo: ', dadosDoForm.get('image'));

            // comunidades.push('Tibianos');

            const comunidade = {
              id: new Date().toISOString(),
              titulo: dadosDoForm.get('title'),
              image: dadosDoForm.get('image')
            }
            const comunidadesAtualizadas = [...comunidades, comunidade];
            setComunidades(comunidadesAtualizadas);
          }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>

            <div>
              <input 
                placeholder="Coloque uma url para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma url para usarmos de capa"
              />
            </div>
            <button>
              Criar comunidade
            </button>
          </form> 


        </Box>
      </div>

      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}> 
      <ProfileRelationsBoxWrapper>
          <h2 className="smalltitle"> 
            comunidades ({comunidades.length})
          </h2>

          <ul>
            {comunidades.map((itemAtual) => {
              return (
                <li key={itemAtual.id}>
                  <a href={`/users/${itemAtual.title}`}>
                    <img src={itemAtual.image} />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>

      </ProfileRelationsBoxWrapper>
        
        <ProfileRelationsBoxWrapper>
          <h2 className="smalltitle"> 
            Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>

          <ul>
            {pessoasFavoritas.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
      </div>      
    </MainGrid>
  </>
  )
}
