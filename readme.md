# Como funciona?
- Para fazer o bot roda você precisa do **Csrf-Token**, **Bearer** e **Cookie**<br>
L Você pode pega os tokens no console (**CTRL + SHIFT + C > Network**) ou passando **Fiddler Classic**<br>
- Depois de pega os **tokens** você altera o nome de **.env.example** para **.env** e adiciona os **tokens**.
- Agora você precisa adicionar as imagens em **src > assets**<br>
L Aconselho que adicione ás **imagens** em **PNG ou JPG**
- Pronto, agora você pode ligar o bot.<br> 
L As imagens será enviada a cada **20 minutos**, você pode alterar o tempo em **src > services > Twitter > Linha 106**