import { faker } from '@faker-js/faker';

export function createRandomUser() {
        return {
            'username': faker.internet.userName(),
            'email': faker.internet.email(),
            'password': faker.internet.password(),
        };
}