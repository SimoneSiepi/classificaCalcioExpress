function updateSquadre(selectedSquadra, otherSquadra) {
    var selectedValue = document.getElementById(selectedSquadra).value;
    var otherSelect = document.getElementById(otherSquadra);

    for (var i = 0; i < otherSelect.options.length; i++) {
        if (otherSelect.options[i].value === selectedValue) {
            otherSelect.options[i].disabled = true;
        } else {
            otherSelect.options[i].disabled = false;
        }
    }
}