import { EventData, ObservableArray } from '@nativescript/core';
import { Page } from '@nativescript/core';
import { Observable } from '@nativescript/core';

import { Person } from '~/models/person';

import { PersonService } from './services/person.service';

let page: Page;
let viewModel: Observable;
let service: PersonService;

export function navigatingTo(args: EventData) {
  page = <Page>args.object;
  viewModel = new Observable();
  viewModel.set('persons', new ObservableArray<Person>());
  page.bindingContext = viewModel;

  service = new PersonService();
  setTimeout(loadPeople, 500); // pequeña espera para cargar BD
}

function loadPeople() {
  service.getAll().then(people => {
    const list = new ObservableArray(people.map(p => ({
      ...p,
      deletePerson: () => {
        service.delete(p.id).then(loadPeople);
      }
    })));
    viewModel.set('persons', list);
  });
}

export function onAddPerson() {
  const person: Person = {
    id: 0,
    name: 'Persona ' + Math.floor(Math.random() * 100),
    age: Math.floor(Math.random() * 50) + 20
  };
  service.create(person).then(loadPeople);
}
//D:\Moviles\Investigación NativeScript\NativaScriptPractice\crud-personas\app\home\home-page.ts