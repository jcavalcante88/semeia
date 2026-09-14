-- Apaga os usuarios ficticios usados para conferir o podio do ranking.
-- Rode isto quando quiser deixar o banco limpo para as pessoas de verdade.
-- O `on delete cascade` leva junto respostas, preferencias, envios e inscricoes.

delete from usuarios where apelido in ('Ana', 'Bruno', 'Carla', 'Diego', 'Elisa');

-- Confere o que sobrou:
select (select count(*) from usuarios)  as usuarios,
       (select count(*) from respostas) as respostas;
