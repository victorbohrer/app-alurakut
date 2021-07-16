import React from 'react';
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
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

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smalltitle"> 
            {props.title} ({props.items.length})
          </h2>

          {/* <ul>
            {props.items.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`https://github.com/${itemAtual}.png`}>
                    <img src={itemAtual.image} />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })}
          </ul> */}
      </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {
  const usuarioAleatorio = props.githubUser;

  const [comunidades, setComunidades] = React.useState([]);
  //   id: '23123231321',
  //   title: 'Eu odeio acordar cedo',
  //   image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  // }])

  // const comunidades = ['Tibianos'];


  const pessoasFavoritas = ['marcobrunodev', 'danielhe4rt', 'peas', 'juunegreiros', 'juunegreiros', 'juunegreiros']

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function (){

    // GET
    fetch('https://api.github.com/users/victorbohrer/followers')
    .then(function (repostaDoServidor) {
      return repostaDoServidor.json()
    })
    .then(function (repostaConvertida) {
      setSeguidores(repostaConvertida)
    })

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '95b37676549ea4a53cd2a821efe887',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          title
          id
          imageUrl
        }
      }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const comunidadesDato = respostaCompleta.data.allCommunities
      setComunidades(comunidadesDato)

    })

  }, [])

  
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

            const comunidade = {
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              
            }

            fetch('/api/comunidades', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(comunidade)
            })
            .then(async (response) => {
              const dados = await response.json()
              console.log(dados.registroCriado)
              
              const comunidade = dados.registroCriado;

              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
            })

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

      <ProfileRelationsBox title="Seguidores" items={seguidores} />    

      <ProfileRelationsBoxWrapper>
          <h2 className="smalltitle"> 
            comunidades ({comunidades.length})
          </h2>

          <ul>
            {comunidades.map((itemAtual) => {
              return (
                <li key={itemAtual.id}>
                  <a href={`/communities/${itemAtual.id}`}>
                    <img src={itemAtual.imageUrl} />
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token) 
  
  return {
    props: {
      githubUser
    },
  }
}
