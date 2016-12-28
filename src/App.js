import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';

moment.locale('es');

class Repo extends Component {
  stringNull(param){
    if(param === null ){return 'Sin especificar'}
    else { return param}
  }

  render(){
    let rep = this.props.repo;
    return <li className='repo'>
      <a href={rep.html_url} className='repo-name'>{rep.name}</a>
      <p className='repo-description'>{rep.description}</p>
      <div className='repo-git-info'>
        <p>Lenguaje: {this.stringNull(rep.language)}</p>
        <img src='./img/git-branch.png' alt='Branch'/>
        <p>{rep.default_branch}</p>
        <img src='./img/eye.png' alt='Eye'/>
        <p>{rep.watchers_count}</p>
        <img src='./img/download.png' alt='Download'/>
        <p><a href={rep.clone_url}>Clonar</a></p>
        <p>Última actualización: {moment(rep.updated_at).fromNow()}</p>
      </div>
    </li>;
  }
}


class Repos extends Component {
  render(){
      return <ul className='repos' >{this.props.repos.map((rep)=>{return <Repo key={rep.id} repo={rep} />})}</ul>;
  }
}


class GitInfo extends Component {

  render(){
    const user = this.props.git;
    if(!user.name){
        return <p>Ningun usuario GitHub con este nombre</p>;
    }
    else {
      return <div className='git-info'>
        <p className='user-name'>Usuario, {user.name} :</p>
        <img className='avatar' src={user.avatar_url} alt="Avatar"/>
        <p>Repositorios:</p>
        <div id='repos'>
        </div>
      </div>;
      }
    }

    renderGitRepos(param){
      ReactDOM.render(<Repos repos={param}/>,document.getElementById('repos'));
    }

    componentDidMount(){
      this.searchRepos(this.props.git,this.props.include);
    }

    componentWillReceiveProps(nextProps){
      this.searchRepos(nextProps.git);
    }

    searchRepos(param,param2){
      let url = `${param.repos_url}?sort=updated`;
      if(param2 ){
          url += '&type=all';
      }
      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson) {
            this.renderGitRepos(responseJson);
          }
        })
        .catch((err) =>	console.log(`Ocurrio algo: ${err}`)
      );
    }

  }

class App extends Component {
  constructor(){
    super();
    this.state = {nombre: 'Extraño',incluir: false};
  }

  handleCheck(ev){
    this.setState({incluir: ev.target.checked});
  }

  handlerChange(ev){
    if(ev.target.value !== "") this.setState({nombre: ev.target.value});
    else this.setState({nombre: "Extraño"});
  }

  handlerClick(){
      var url = 'https://api.github.com/users/';
      const include = this.state.incluir;
      if(this.state.nombre !== ''){ url += this.state.nombre;}
      else {url += 'kamiloC'}
      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson) {
            this.renderGitInfo(responseJson,include);
          }
        })
        .catch((err) =>	console.log(`Ocurrio algo: ${err}`)
      );
  }

  handlerKeyPress(e){
    let key  = e.which || e.keyCode;
    if(key === 13){
      this.handlerClick();
    }
  }

  renderGitInfo(param,param2){
    ReactDOM.render(<GitInfo git={param} include={param2} />,document.getElementById('git-info'));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Practicando React</h2>
        </div>
        <p>Ingresa un nombre de usuario GitHub y mira sus repositorios actuales: </p>
        <input className="input-text" type="text" placeholder="Usuario GitHub" onChange={this.handlerChange.bind(this)} onKeyPress={this.handlerKeyPress.bind(this)}></input>
        <button className="button" onClick={this.handlerClick.bind(this)}>Buscar
        </button>
        <div className="input-check">
        <input type="checkbox" id="include" onChange={this.handleCheck.bind(this)} checked={this.state.incluir}/>
        <label for="include">Incluir repositorios en los que contribuye</label>
        </div>
        <div id='git-info'></div>
      </div>
    );
  }
}

export default App;
