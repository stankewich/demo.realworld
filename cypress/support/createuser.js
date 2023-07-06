import { faker } from '@faker-js/faker';

function createRandomUser() {
    return {
        'username': faker.internet.userName(),
        'email': faker.internet.email(),
        'password': faker.internet.password(),
    };
}

export const randomUser = createRandomUser();